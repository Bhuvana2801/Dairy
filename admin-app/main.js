// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJ4oNdqQGC0RDAJ5h80DCch9c8cqTkNpY",
    authDomain: "bhuvan-8fb89.firebaseapp.com",
    projectId: "bhuvan-8fb89",
    storageBucket: "bhuvan-8fb89.firebasestorage.app",
    messagingSenderId: "748047958637",
    appId: "1:748047958637:web:309f0727f17224a6fab564",
    measurementId: "G-XJ5BTVN1GT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// App State
let currentUser = null;
let currentSection = null;
let sectionData = [];
let editingId = null;

const schema = {
    daily: {
        title: 'Daily Report',
        desc: 'Track daily farm activities',
        fields: ['date', 'item', 'qty', 'note'],
        labels: ['Date', 'Item', 'Qty', 'Note'],
        editable: true
    },
    expenses: {
        title: 'Monthly Expenses',
        desc: 'Track farm expenditures',
        fields: ['month', 'category', 'amount', 'note'],
        labels: ['Month', 'Category', 'Amount', 'Note'],
        editable: true
    },
    production: {
        title: 'Production Tracking',
        desc: 'Monitor farm output',
        fields: ['date', 'product', 'quantity', 'status'],
        labels: ['Date', 'Product', 'Qty', 'Status'],
        editable: true
    },
    orders: {
        title: 'Order Verification',
        desc: 'Review and confirm customer orders',
        fields: ['orderID', 'name', 'product', 'qty', 'status'],
        labels: ['ID', 'Customer', 'Product', 'Qty', 'Status'],
        editable: false
    },
    salaries: {
        title: 'Salary Management',
        desc: 'Manage staff payments',
        fields: ['name', 'role', 'amount', 'month'],
        labels: ['Name', 'Role', 'Amount', 'Month'],
        editable: true
    },
    'monthly-report': {
        title: 'Monthly Report',
        desc: 'Summary of performance',
        fields: ['orderID', 'name', 'amount', 'date', 'status'],
        labels: ['ID', 'Customer', 'Amount', 'Date', 'Status'],
        editable: false
    }
};

// Login Logic
function login() {
    const id = document.getElementById('adminId').value;
    const pw = document.getElementById('adminPw').value;
    const error = document.getElementById('errorMsg');

    if (id === '20005' && pw === '9866') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        localStorage.setItem('adfAdminAuth', 'true');
    } else {
        error.textContent = 'Invalid credentials. Please try again.';
    }
}

function logout() {
    localStorage.removeItem('adfAdminAuth');
    location.reload();
}

// Check auth on load
window.onload = () => {
    if (localStorage.getItem('adfAdminAuth') === 'true') {
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
    }

    // Register Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Admin SW Registered'))
            .catch(err => console.error('Admin SW Failed', err));
    }
};

// Navigation
function showGrid() {
    document.getElementById('grid-view').style.display = 'grid';
    document.getElementById('section-view').style.display = 'none';
    currentSection = null;
}

function openSection(sectionId) {
    currentSection = sectionId;
    const s = schema[sectionId];
    
    document.getElementById('grid-view').style.display = 'none';
    document.getElementById('section-view').style.display = 'block';
    
    document.getElementById('section-title').textContent = s.title;
    document.getElementById('section-desc').textContent = s.desc;
    
    // Setup UI
    document.getElementById('add-form-container').style.display = s.editable ? 'block' : 'none';
    document.getElementById('exportBtn').style.display = sectionId !== 'monthly-report' ? 'block' : 'none';
    document.getElementById('report-filter').style.display = sectionId === 'monthly-report' ? 'block' : 'none';
    
    if (s.editable) {
        renderInputs(s);
    }
    
    loadData(sectionId);
}

function renderInputs(s) {
    const container = document.getElementById('dynamic-inputs');
    container.innerHTML = s.fields.map((f, i) => `
        <input type="${f === 'date' ? 'date' : 'text'}" id="field_${f}" placeholder="${s.labels[i]}">
    `).join('');
    
    const btn = document.getElementById('submitBtn');
    btn.textContent = '+ Add Entry';
    btn.onclick = saveRecord;
    editingId = null;
}

// Data Handling
function loadData(sectionId) {
    const tableHead = document.getElementById('table-head');
    const tableBody = document.getElementById('table-body');
    const s = schema[sectionId];

    tableHead.innerHTML = `<tr>${s.labels.map(l => `<th>${l}</th>`).join('')}<th>Actions</th></tr>`;
    tableBody.innerHTML = '<tr><td colspan="100%" style="text-align:center;padding:2rem;">Loading data...</td></tr>';

    let collection = sectionId === 'monthly-report' ? 'orders' : sectionId;
    
    db.collection(collection).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
        sectionData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTable(sectionId);
    });
}

function renderTable(sectionId) {
    const tableBody = document.getElementById('table-body');
    const s = schema[sectionId];
    
    if (sectionData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="100%" style="text-align:center;padding:2rem;color:#999;">No records found.</td></tr>';
        return;
    }

    tableBody.innerHTML = sectionData.map(row => `
        <tr>
            ${s.fields.map(f => `<td>${row[f] || '-'}</td>`).join('')}
            <td>
                <div class="action-btns">
                    ${s.editable ? `<button class="btn-sm btn-edit" onclick="editEntry('${row.id}')">✎</button>` : ''}
                    ${currentSection === 'orders' ? `<button class="btn-sm btn-edit" style="background:#28a745" onclick="verifyOrder('${row.id}')">✓</button>` : ''}
                    <button class="btn-sm btn-delete" onclick="deleteEntry('${row.id}')">✕</button>
                </div>
            </td>
        </tr>
    `).join('');
}

async function verifyOrder(id) {
    const status = prompt("Enter new status (e.g. Confirmed, Reverify):", "Confirmed");
    if (!status) return;
    try {
        await db.collection('orders').doc(id).update({ status: status });
        alert("Order status updated!");
    } catch (e) {
        alert("Error: " + e.message);
    }
}

async function saveRecord() {
    const s = schema[currentSection];
    const newRecord = {
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    let valid = false;
    s.fields.forEach(f => {
        const val = document.getElementById(`field_${f}`).value;
        newRecord[f] = val;
        if (val) valid = true;
    });

    if (!valid) return alert('Please fill at least one field');

    try {
        if (editingId) {
            await db.collection(currentSection).doc(editingId).update(newRecord);
            editingId = null;
        } else {
            await db.collection(currentSection).add(newRecord);
        }
        renderInputs(s); // Clear inputs
    } catch (e) {
        alert('Error saving record: ' + e.message);
    }
}

function editEntry(id) {
    const row = sectionData.find(r => r.id === id);
    if (!row) return;
    
    editingId = id;
    const s = schema[currentSection];
    
    s.fields.forEach(f => {
        document.getElementById(`field_${f}`).value = row[f] || '';
    });
    
    const btn = document.getElementById('submitBtn');
    btn.textContent = 'Update Entry';
    btn.onclick = saveRecord;
}

async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;
    
    try {
        let collection = currentSection === 'monthly-report' ? 'orders' : currentSection;
        await db.collection(collection).doc(id).delete();
    } catch (e) {
        alert('Error deleting: ' + e.message);
    }
}

function exportData() {
    if (!currentSection || sectionData.length === 0) return;
    
    const s = schema[currentSection];
    let csv = s.labels.join(',') + '\n';
    
    sectionData.forEach(row => {
        csv += s.fields.map(f => `"${row[f] || ''}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSection}_${new Date().toLocaleDateString()}.csv`;
    a.click();
}

function loadReportData() {
    const month = document.getElementById('monthFilter').value;
    if (!month) return;
    
    // Filter logic for monthly report
    const [year, monthNum] = month.split('-');
    // Re-render table with filtered data if needed, 
    // though the current sync listener already gets all orders.
    // We can filter sectionData locally.
    const filtered = sectionData.filter(row => {
        const date = row.date || row.placedAt || '';
        return date.includes(`${monthNum}/${year}`) || date.includes(`${year}-${monthNum}`);
    });
    
    // Manual render for filtered data
    const tableBody = document.getElementById('table-body');
    const s = schema['monthly-report'];
    tableBody.innerHTML = filtered.map(row => `
        <tr>
            ${s.fields.map(f => `<td>${row[f] || '-'}</td>`).join('')}
            <td>
                <button class="btn-sm btn-delete" onclick="deleteEntry('${row.id}')">✕</button>
            </td>
        </tr>
    `).join('');
}
