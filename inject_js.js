const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startTag = '    async function handleDailyOrderSubmit(e) {';
const endTag = '    function resetAndBackToHome() {';

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag);

const newJs = `
    function syncWhatsAppPhone() {
        const phone = document.getElementById('orderPhone').value;
        const wa = document.getElementById('orderWhatsapp');
        if (wa && document.activeElement !== wa) {
            wa.value = phone;
        }
    }

    function updateOrderTotalPricing() {
        const qtys = {
            milk: parseFloat(document.getElementById('orderQtyMilk').value) || 0,
            curd: parseFloat(document.getElementById('orderQtyCurd').value) || 0,
            ghee: parseFloat(document.getElementById('orderQtyGhee').value) || 0
        };
        const prices = { milk: 100, curd: 60, ghee: 600 };
        const subtotal = (qtys.milk * prices.milk) + (qtys.curd * prices.curd) + (qtys.ghee * prices.ghee);
        document.getElementById('masterSummarySubtotal').textContent = '₹' + subtotal;
        document.getElementById('masterSummaryFinalAmt').textContent = '₹' + subtotal;
        document.getElementById('masterSummaryFrequency').textContent = 
            document.getElementById('orderSubscriptionType').value === 'Daily' ? 'Per Order / Per Day' : 'One-Time';
    }

    async function handleMasterOrderSubmit(e) {
        if (e) e.preventDefault();

        // 1. Gather Data
        const name = document.getElementById('orderName').value;
        const phone = document.getElementById('orderPhone').value;
        const wa = document.getElementById('orderWhatsapp').value;
        const subType = document.getElementById('orderSubscriptionType').value;
        
        const qtys = {
            milk: parseFloat(document.getElementById('orderQtyMilk').value) || 0,
            curd: parseFloat(document.getElementById('orderQtyCurd').value) || 0,
            ghee: parseFloat(document.getElementById('orderQtyGhee').value) || 0
        };

        if (qtys.milk === 0 && qtys.curd === 0 && qtys.ghee === 0) {
            document.getElementById('productSelectError').style.display = 'block';
            return;
        }
        document.getElementById('productSelectError').style.display = 'none';

        const area = document.getElementById('orderArea').value;
        if (!area) { alert("Please select a delivery area."); return; }
        const address = \`House \${document.getElementById('orderAddressHouse').value}, \${document.getElementById('orderAddressStreet').value}\` 
                        + (document.getElementById('orderAddressLandmark').value ? \`, \${document.getElementById('orderAddressLandmark').value}\` : '');
        
        const startDate = document.getElementById('orderDate').value;
        const slot = document.getElementById('orderSlot').value;
        const payment = document.getElementById('orderPayment').value;

        const prices = { milk: 100, curd: 60, ghee: 600 };
        const subtotal = (qtys.milk * prices.milk) + (qtys.curd * prices.curd) + (qtys.ghee * prices.ghee);

        const btn = document.getElementById('masterSubmitBtn');
        const errBox = document.getElementById('orderErrorMsg');
        btn.disabled = true;
        btn.innerHTML = '⏳ Confirming Order...';
        errBox.style.display = 'none';

        try {
            // GENERATE GLOBAL ORDER ID ATOMICALLY 
            const seqRef = db.collection('metadata').doc('orderSequence');
            const orderNum = await db.runTransaction(async (t) => {
                const doc = await t.get(seqRef);
                let nextId = 2800; // Specification Start
                if (doc.exists && doc.data().lastId) {
                    nextId = doc.data().lastId + 1;
                }
                t.set(seqRef, { lastId: nextId }, { merge: true });
                return nextId;
            });
            const globalOrderId = \`ADFD\${orderNum}\`;

            // CREATE SUBSCRIPTION RECORD IF DAILY
            let subscriptionId = '';
            let productListStr = [];
            let itemsSnapshot = [];
            
            if (qtys.milk > 0) { productListStr.push(\`Buffalo Milk (\${qtys.milk})\`); itemsSnapshot.push({product: 'Buffalo Milk', qty: qtys.milk, price: prices.milk}); }
            if (qtys.curd > 0) { productListStr.push(\`Fresh Curd (\${qtys.curd})\`); itemsSnapshot.push({product: 'Fresh Curd', qty: qtys.curd, price: prices.curd}); }
            if (qtys.ghee > 0) { productListStr.push(\`Buffalo Ghee (\${qtys.ghee})\`); itemsSnapshot.push({product: 'Buffalo Ghee', qty: qtys.ghee, price: prices.ghee}); }

            if (subType === 'Daily') {
                const subRef = db.collection('subscriptions').doc();
                subscriptionId = subRef.id;
                await subRef.set({
                    subscriptionId: subscriptionId,
                    name, phone, wa, area, address, slot,
                    status: 'ACTIVE',
                    items: itemsSnapshot,
                    startDate: startDate,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // CREATE THE FIRST ORDER
            const orderDoc = {
                orderID: globalOrderId,
                subscriptionId: subscriptionId,
                orderType: subType,
                name: name,
                phone: phone,
                wa: wa,
                products: productListStr.join(', '),
                items: itemsSnapshot,
                subtotal: subtotal.toString(),
                total: subtotal.toString(),
                deliveryDate: startDate,
                deliverySlot: slot,
                city: 'Narasaraopet',
                area: area,
                address: address,
                paymentMethod: payment,
                paymentStatus: payment === 'UPI' ? 'Paid' : 'Pending',
                orderStatus: 'Confirmed',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('orders').add(orderDoc);

            // SUCCESS SHOW
            document.getElementById('masterOrderForm').style.display = 'none';
            const successBox = document.getElementById('orderSuccessBox');
            const successId = document.getElementById('orderSuccessId');
            if (successId) successId.textContent = globalOrderId;
            if (successBox) successBox.style.display = 'block';

            // TRIGGER WHATSAPP AUTOMATION MESSAGE
            const waMsg = 
                \`NEW DAIRY ORDER\\n\\n\` +
                \`Order ID: \${globalOrderId}\\n\\n\` +
                \`Customer:\\nName: \${name}\\nPhone: \${phone}\\nWhatsApp: \${wa}\\n\\n\` +
                \`Subscription:\\n\${subType}\\n\\n\` +
                \`Products:\\n\${itemsSnapshot.map(i => \`\${i.product} - \${i.qty} - ₹\${i.qty * i.price}\`).join('\\n')}\\n\\n\` +
                \`Grand Total: ₹\${subtotal}\\n\\n\` +
                \`Delivery Date: \${startDate}\\nDelivery Time: \${slot}\\n\\n\` +
                \`City: Narasaraopet\\nArea: \${area}\\nDelivery Address: \${address}\\n\\n\` +
                \`Payment Method: \${payment}\`;
            
            const waUrl = \`https://wa.me/9493207380?text=\${encodeURIComponent(waMsg)}\`;
            window.open(waUrl, '_blank');

        } catch (err) {
            console.error("Order submission error:", err);
            errBox.style.display = 'block';
            errBox.textContent = "Unable to place your order. Please try again.";
            btn.disabled = false;
            btn.innerHTML = '💳 Confirm Order';
        }
    }

`;

if (startIndex > -1 && endIndex > -1) {
    html = html.substring(0, startIndex) + newJs + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log('Successfully injected master order js');
} else {
    console.log('Could not find JS injection tags');
}
