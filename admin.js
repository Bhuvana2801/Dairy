// Admin Pro Logic for Ayyappa Dairy Farm
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // UI Selectors
    const sidebarItems = document.querySelectorAll('.sidebar-nav li');
    const bottomNavItems = document.querySelectorAll('.bottom-nav .nav-item');
    const mainSections = document.querySelectorAll('.content-area > div');
    const sectionTitle = document.getElementById('sectionTitle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const sidebar = document.querySelector('.sidebar');
    const currentDateEl = document.getElementById('currentDate');

    // State
    let currentSection = 'dashboard';
    let data = { daily: [], expenses: [], production: [], salaries: [], orders: [] };

    // Set Date
    const now = new Date();
    currentDateEl.textContent = now.toLocaleDateString('en-IN', { month: 'short', day: '2-digit', year: 'numeric' });

    // --- Firebase Setup ---
    const firebaseConfig = {
        apiKey: "AIzaSyCJ4oNdqQGC0RDAJ5h80DCch9c8cqTkNpY",
        authDomain: "bhuvan-8fb89.firebaseapp.com",
        projectId: "bhuvan-8fb89",
        storageBucket: "bhuvan-8fb89.firebasestorage.app",
        messagingSenderId: "748047958637",
        appId: "1:748047958637:web:309f0727f17224a6fab564",
        measurementId: "G-XJ5BTVN1GT"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // --- Navigation ---
    const switchSection = (sectionId) => {
        currentSection = sectionId;
        
        // Update Sidebar UI
        sidebarItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update Bottom Nav UI
        bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.section === sectionId);
        });

        // Update Content UI
        const isTableSection = ['orders', 'production', 'expenses', 'salaries', 'reports'].includes(sectionId);
        
        document.getElementById('section-dashboard').classList.toggle('active', sectionId === 'dashboard');
        document.getElementById('section-table').classList.toggle('active', isTableSection);
        
        // Update Title
        const titleMap = {
            dashboard: 'Overview',
            orders: 'Order Management',
            production: 'Production Logs',
            expenses: 'Farm Expenses',
            salaries: 'Staff Salaries',
            reports: 'Financial Reports'
        };
        sectionTitle.textContent = titleMap[sectionId] || 'Admin';

        if (isTableSection) {
            renderTable(sectionId);
        }

        if (window.innerWidth <= 1024) sidebar.classList.remove('active');
    };

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => switchSection(item.dataset.section));
    });

    bottomNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            switchSection(item.dataset.section);
        });
    });

    sidebarToggle.addEventListener('click', () => sidebar.classList.add('active'));
    sidebarClose.addEventListener('click', () => sidebar.classList.remove('active'));

    // --- Real-time Listeners ---
    const setupListeners = () => {
        const collections = ['daily', 'expenses', 'production', 'salaries', 'orders'];
        collections.forEach(col => {
            db.collection(col).orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                data[col] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                updateDashboardStats();
                if (currentSection === col) renderTable(col);
                if (currentSection === 'dashboard') updateRecentOrders();
            });
        });
    };

    // --- Dashboard Logic ---
    const updateDashboardStats = () => {
        // Revenue (Verified/Confirmed orders)
        const revenue = data.orders
            .filter(o => o.status === 'Confirmed' || o.paymentStatus === 'Paid')
            .reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
        document.getElementById('stat-revenue').textContent = `₹${revenue.toLocaleString()}`;

        // Orders count
        document.getElementById('stat-orders').textContent = data.orders.length;

        // Yield (from production logs)
        const totalYield = data.production
            .reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
        document.getElementById('stat-yield').textContent = totalYield;

        // Active Subscriptions (Monthly plans)
        const activeSubs = data.orders.filter(o => o.paymentType === 'Monthly').length;
        document.getElementById('stat-subs').textContent = activeSubs;

        updateCharts();
    };

    const updateRecentOrders = () => {
        const list = document.getElementById('recentOrdersList');
        if (!list) return;
        
        const recent = data.orders.slice(0, 5);
        if (recent.length === 0) {
            list.innerHTML = '<p style="padding: 1rem; text-align: center; color: #999;">No orders yet.</p>';
            return;
        }

        list.innerHTML = recent.map(o => `
            <div class="mini-order-item" style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: 700; font-size: 0.9rem;">${o.name}</div>
                    <div style="font-size: 0.75rem; color: #888;">${o.product} • ${o.orderID}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: 700; color: var(--primary);">₹${o.amount}</div>
                    <div style="font-size: 0.7rem; background: #eee; padding: 2px 6px; border-radius: 4px;">${o.status || 'Pending'}</div>
                </div>
            </div>
        `).join('');
    };

    // --- Charting ---
    let myChart = null;
    const updateCharts = () => {
        const ctx = document.getElementById('productionChart');
        if (!ctx) return;

        if (myChart) myChart.destroy();

        // Sample logic for daily sales/yield over last 7 entries
        const labels = data.production.slice(0, 7).reverse().map(p => p.date || 'N/A');
        const yieldData = data.production.slice(0, 7).reverse().map(p => parseFloat(p.quantity) || 0);
        
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Milk Yield (L)',
                    data: yieldData,
                    borderColor: '#1A5C2A',
                    backgroundColor: 'rgba(26, 92, 42, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    };

    // --- Table Rendering ---
    const renderTable = (sectionId) => {
        const thead = document.getElementById('tableHead');
        const tbody = document.getElementById('tableBody');
        const emptyState = document.getElementById('tableEmptyState');
        const addNewBtn = document.getElementById('addNewBtn');

        // Configs
        const configs = {
            orders: {
                headers: ['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Actions'],
                row: (o) => `
                    <td><strong>${o.orderID}</strong></td>
                    <td>${o.name}<br><small>${o.phone}</small></td>
                    <td>${o.product}<br><small>${o.qty}</small></td>
                    <td>₹${o.amount}</td>
                    <td><span class="badge-status ${o.status === 'Pending Verification' ? 'Pending' : (o.status || 'Pending')}">${o.status || 'Pending'}</span></td>
                    <td>
                        <button class="icon-btn-sm" onclick="verifyOrder('${o.id}')"><i data-lucide="check-circle"></i></button>
                        <button class="icon-btn-sm danger" onclick="deleteItem('orders', '${o.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                `
            },
            production: {
                headers: ['Date', 'Product', 'Quantity', 'Status', 'Actions'],
                row: (p) => `
                    <td>${p.date}</td>
                    <td>${p.product}</td>
                    <td>${p.quantity}</td>
                    <td>${p.status}</td>
                    <td>
                        <button class="icon-btn-sm danger" onclick="deleteItem('production', '${p.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                `
            },
            expenses: {
                headers: ['Month', 'Category', 'Amount', 'Note', 'Actions'],
                row: (e) => `
                    <td>${e.month}</td>
                    <td>${e.category}</td>
                    <td>₹${e.amount}</td>
                    <td>${e.note || '-'}</td>
                    <td>
                        <button class="icon-btn-sm danger" onclick="deleteItem('expenses', '${e.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                `
            },
            salaries: {
                headers: ['Name', 'Role', 'Amount', 'Month', 'Actions'],
                row: (s) => `
                    <td>${s.name}</td>
                    <td>${s.role}</td>
                    <td>₹${s.amount}</td>
                    <td>${s.month}</td>
                    <td>
                        <button class="icon-btn-sm danger" onclick="deleteItem('salaries', '${s.id}')"><i data-lucide="trash-2"></i></button>
                    </td>
                `
            }
        };

        const config = configs[sectionId] || { headers: [], row: () => '' };
        
        thead.innerHTML = `<tr>${config.headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        
        const list = data[sectionId] || [];
        if (list.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
            tbody.innerHTML = list.map(item => `<tr>${config.row(item)}</tr>`).join('');
        }

        lucide.createIcons();
    };

    // --- Modals & Forms ---
    const genericModal = document.getElementById('genericModal');
    const genericForm = document.getElementById('genericForm');
    const formFields = document.getElementById('formFields');
    const modalTitle = document.getElementById('modalTitle');
    const addNewBtn = document.getElementById('addNewBtn');

    const openModal = (type) => {
        const fieldConfigs = {
            production: [
                { name: 'date', label: 'Date', type: 'date', required: true },
                { name: 'product', label: 'Product', type: 'text', placeholder: 'Milk, Curd, etc.', required: true },
                { name: 'quantity', label: 'Quantity (L/Kg)', type: 'number', required: true },
                { name: 'status', label: 'Status', type: 'select', options: ['Processed', 'Stored', 'Delivered'] }
            ],
            expenses: [
                { name: 'month', label: 'Month', type: 'month', required: true },
                { name: 'category', label: 'Category', type: 'text', placeholder: 'Feed, Electricity, etc.', required: true },
                { name: 'amount', label: 'Amount (₹)', type: 'number', required: true },
                { name: 'note', label: 'Note', type: 'textarea' }
            ],
            salaries: [
                { name: 'name', label: 'Staff Name', type: 'text', required: true },
                { name: 'role', label: 'Role', type: 'text', required: true },
                { name: 'amount', label: 'Salary Amount', type: 'number', required: true },
                { name: 'month', label: 'Month', type: 'month', required: true }
            ]
        };

        const config = fieldConfigs[type];
        if (!config) return;

        modalTitle.textContent = `Add New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        genericForm.dataset.type = type;
        
        formFields.innerHTML = config.map(f => `
            <div class="form-group" style="margin-bottom: 1.2rem;">
                <label style="display:block; margin-bottom: 0.5rem; font-weight: 600; font-size: 0.9rem;">${f.label}</label>
                ${f.type === 'select' ? `
                    <select name="${f.name}" class="glass-input" style="width:100%" ${f.required ? 'required' : ''}>
                        ${f.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                ` : f.type === 'textarea' ? `
                    <textarea name="${f.name}" class="glass-input" style="width:100%; height: 80px;" placeholder="${f.placeholder || ''}"></textarea>
                ` : `
                    <input type="${f.type}" name="${f.name}" class="glass-input" style="width:100%" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>
                `}
            </div>
        `).join('');

        genericModal.classList.add('active');
    };

    window.closeModal = () => genericModal.classList.remove('active');

    genericForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = genericForm.dataset.type;
        const formData = new FormData(genericForm);
        const dataObj = Object.fromEntries(formData.entries());
        
        dataObj.createdAt = firebase.firestore.FieldValue.serverTimestamp();

        try {
            await db.collection(type).add(dataObj);
            closeModal();
            genericForm.reset();
        } catch (err) { alert('Error: ' + err.message); }
    });

    if (addNewBtn) {
        addNewBtn.addEventListener('click', () => openModal(currentSection));
    }

    // Global Functions (attached to window for HTML access)
    window.handleLogout = () => {
        if(confirm('Are you sure you want to logout?')) {
            window.location.href = 'index.html';
        }
    };

    window.deleteItem = async (col, id) => {
        if (!confirm('Confirm deletion?')) return;
        try {
            await db.collection(col).doc(id).delete();
            // Snapshot will auto-refresh
        } catch (err) { alert('Error: ' + err.message); }
    };

    window.verifyOrder = async (id) => {
        const status = prompt('Enter status (Confirmed/Delivered/Cancelled):', 'Confirmed');
        if (!status) return;
        try {
            await db.collection('orders').doc(id).update({ status });
        } catch (err) { alert('Error: ' + err.message); }
    };

    window.exportCurrentTable = () => {
        const table = document.getElementById('mainDataTable');
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(row => {
            const cols = row.querySelectorAll('td, th');
            const rowData = Array.from(cols).map(c => `"${c.innerText.replace(/"/g, '""')}"`);
            csv.push(rowData.join(','));
        });

        const csvString = csv.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', `${currentSection}_export_${new Date().toISOString().split('T')[0]}.csv`);
        a.click();
    };

    // Init
    setupListeners();
    switchSection('dashboard');
});
