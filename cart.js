// Ayyappa Dairy Farm - Cart Logic

let cartItems = [];

// Product pricing and rules
const productsConfig = {
    milk: {
        id: 'milk',
        name: 'Pure Buffalo Milk',
        basePrice: 100, // per litre
        unit: 'Litre',
        calc: (val) => val * 100,
        options: [
            { text: '0.5 Litre (500 ml) — ₹50', value: 0.5 },
            { text: '1 Litre — ₹100', value: 1 },
            { text: '2 Litres — ₹200', value: 2 },
            { text: '3 Litres — ₹300', value: 3 },
            { text: '4 Litres — ₹400', value: 4 },
            { text: '5 Litres — ₹500', value: 5 },
            { text: '6 Litres — ₹600', value: 6 },
            { text: '7 Litres — ₹700', value: 7 },
            { text: '8 Litres — ₹800', value: 8 },
            { text: '9 Litres — ₹900', value: 9 },
            { text: '10 Litres — ₹1,000', value: 10 }
        ]
    },
    curd: {
        id: 'curd',
        name: 'Fresh Curd',
        basePrice: 60, // per kg
        unit: 'Kg',
        calc: (val) => val * 60,
        options: [
            { text: '500 g — ₹30', value: 0.5 },
            { text: '1 Kg — ₹60', value: 1 },
            { text: '2 Kg — ₹120', value: 2 },
            { text: '3 Kg — ₹180', value: 3 },
            { text: '4 Kg — ₹240', value: 4 },
            { text: '5 Kg — ₹300', value: 5 },
            { text: '6 Kg — ₹360', value: 6 },
            { text: '7 Kg — ₹420', value: 7 },
            { text: '8 Kg — ₹480', value: 8 },
            { text: '9 Kg — ₹540', value: 9 },
            { text: '10 Kg — ₹600', value: 10 }
        ]
    },
    ghee: {
        id: 'ghee',
        name: 'Original Ghee',
        basePrice: 600, // per litre
        unit: 'Litre',
        calc: (val) => val * 600,
        options: [
            { text: '500 ml — ₹300', value: 0.5 },
            { text: '1 Litre — ₹600', value: 1 },
            { text: '2 Litres — ₹1,200', value: 2 },
            { text: '3 Litres — ₹1,800', value: 3 },
            { text: '4 Litres — ₹2,400', value: 4 },
            { text: '5 Litres — ₹3,000', value: 5 },
            { text: '6 Litres — ₹3,600', value: 6 },
            { text: '7 Litres — ₹4,200', value: 7 },
            { text: '8 Litres — ₹4,800', value: 8 },
            { text: '9 Litres — ₹5,400', value: 9 },
            { text: '10 Litres — ₹6,000', value: 10 }
        ]
    }
};

function formatDisplayQty(productObj, qty) {
    if (productObj.id === 'milk' || productObj.id === 'ghee') {
        if (qty === 0.5) return '500 ml';
        return qty === 1 ? '1 Litre' : `${qty} Litres`;
    } else {
        if (qty === 0.5) return '500 g';
        return qty === 1 ? '1 Kg' : `${qty} Kg`;
    }
}

function addToCart(productId) {
    const selectEl = document.getElementById(`cartQty-${productId}`);
    const qty = parseFloat(selectEl.value);
    
    if (qty === 0 || isNaN(qty)) {
        alert('Please select a valid quantity.');
        return;
    }
    
    const config = productsConfig[productId];
    
    // Check if exists
    const existingIndex = cartItems.findIndex(item => item.id === productId);
    if (existingIndex >= 0) {
        cartItems[existingIndex].qty += qty;
    } else {
        cartItems.push({
            id: productId,
            name: config.name,
            qty: qty,
            config: config
        });
    }
    
    // Reset dropdown
    selectEl.value = "0";
    
    renderCart();
}

function updateCartItemQty(index, change) {
    const item = cartItems[index];
    const newQty = item.qty + change;
    
    if (newQty <= 0) {
        removeCartItem(index);
        return;
    }
    
    item.qty = newQty;
    renderCart();
}

function removeCartItem(index) {
    cartItems.splice(index, 1);
    renderCart();
}

function renderCart() {
    const cartListEl = document.getElementById('cart-items-list');
    const emptyStateEl = document.getElementById('cart-empty-state');
    const layoutEl = document.getElementById('cart-active-layout');
    const cartCountEl = document.getElementById('cart-header-count');
    
    const cartSubtotalEl = document.getElementById('cart-summary-subtotal');
    const cartFinalAmtEl = document.getElementById('cart-summary-final-amt');
    
    // Update Count badge
    const totalItems = cartItems.length;
    cartCountEl.textContent = `Cart (${totalItems})`;
    
    if (totalItems === 0) {
        layoutEl.style.display = 'none';
        emptyStateEl.style.display = 'block';
        return;
    }
    
    layoutEl.style.display = 'grid';
    emptyStateEl.style.display = 'none';
    
    let html = '';
    let subtotal = 0;
    
    cartItems.forEach((item, index) => {
        const itemTotal = item.config.calc(item.qty);
        subtotal += itemTotal;
        const displayQty = formatDisplayQty(item.config, item.qty);
        
        let initialLabelStr = '';
        if (item.config.id === 'milk') initialLabelStr = 'Buffalo Milk';
        else if (item.config.id === 'curd') initialLabelStr = 'Fresh Curd';
        else if (item.config.id === 'ghee') initialLabelStr = 'Desi Ghee';
        
        html += `
            <div class="cart-item-row">
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <div style="width: 60px; height: 60px; border-radius: 8px; overflow: hidden; background: #eee;">
                        <img src="images/${item.config.id === 'milk' ? 'buffalo_milk' : item.config.id === 'curd' ? 'fresh_curd' : 'pure_ghee'}.jpg" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="cart-item-details">
                        <h6>${item.name}</h6>
                        <p>${displayQty} × ₹${item.config.basePrice} / ${item.config.unit}</p>
                        <div class="cart-item-total">₹${itemTotal.toLocaleString('en-IN')}</div>
                    </div>
                </div>
                
                <div class="cart-item-actions">
                    <div class="cart-qty-controls">
                        <button type="button" class="cart-qty-btn" onclick="updateCartItemQty(${index}, -0.5)">−</button>
                        <span class="cart-qty-display">${item.qty}</span>
                        <button type="button" class="cart-qty-btn" onclick="updateCartItemQty(${index}, 0.5)">+</button>
                    </div>
                    <button type="button" class="cart-remove-btn" onclick="removeCartItem(${index})">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartListEl.innerHTML = html;
    
    cartSubtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
    cartFinalAmtEl.textContent = '₹' + subtotal.toLocaleString('en-IN');
}

let isPaymentConfirmed = false;

function confirmUpiPayment() {
    isPaymentConfirmed = 'Completed';
    const btn = document.getElementById('cartSubmitBtn');
    if (btn) btn.click();
}

function pendingUpiPayment() {
    isPaymentConfirmed = 'Pending';
    const btn = document.getElementById('cartSubmitBtn');
    if (btn) btn.click();
}

function cancelUpiPayment() {
    isPaymentConfirmed = false;
    document.getElementById('cart-checkout-view-inner').style.display = 'block';
    document.getElementById('cart-upi-confirm-view').style.display = 'none';
}

function togglePaymentQR() {
    const methodEl = document.getElementById('cartPaymentMethod');
    const qrBox = document.getElementById('paymentQRCodeBox');
    const btn = document.getElementById('cartSubmitBtn');
    if (qrBox && methodEl && btn) {
        if (methodEl.value.includes('Online')) {
            qrBox.style.display = 'block';
            btn.innerHTML = '📲 Pay via UPI App';
        } else {
            qrBox.style.display = 'none';
            btn.innerHTML = '🛒 Confirm Order';
        }
    }
}

function showCartProducts() {
    document.getElementById('cart-main-view').style.display = 'block';
    document.getElementById('cart-checkout-view').style.display = 'none';
    isPaymentConfirmed = false;
    const inner = document.getElementById('cart-checkout-view-inner');
    const upiView = document.getElementById('cart-upi-confirm-view');
    if (inner && upiView) {
        inner.style.display = 'block';
        upiView.style.display = 'none';
    }
}

function proceedToCheckout() {
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    

    
    // Switch view
    document.getElementById('cart-main-view').style.display = 'none';
    document.getElementById('cart-checkout-view').style.display = 'block';
    isPaymentConfirmed = false;
    const inner = document.getElementById('cart-checkout-view-inner');
    const upiView = document.getElementById('cart-upi-confirm-view');
    if (inner && upiView) {
        inner.style.display = 'block';
        upiView.style.display = 'none';
    }
    
    // Set default delivery date to tomorrow natively without any popup/calendar
    const dateInputStr = document.getElementById('cartDeliveryDate');
    const dateDisplay = document.getElementById('cartDeliveryDateDisplay');
    
    if (dateInputStr && dateDisplay) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // YYYY-MM-DD for backend tracking
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        
        // DD/MM/YYYY for fixed display
        dateInputStr.value = `${yyyy}-${mm}-${dd}`;
        dateDisplay.value = `${dd}/${mm}/${yyyy}`;
    }
    
    // Fallback for other dates if needed
    if (typeof setDefaultOrderDates === 'function') setDefaultOrderDates();
}

// Global order submit mapping to dynamic cart items
async function handleDynamicCartSubmit(e) {
    if (e) e.preventDefault();

    // Guest Validation
    const guestName = document.getElementById('guestName').value.trim();
    const guestPhone = document.getElementById('guestPhone').value.trim();
    const guestAddress = document.getElementById('guestAddress').value.trim();
    
    if (!guestName || !guestPhone || !guestAddress) {
        alert("Please fill in all your customer details completely.");
        return;
    }

    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const slot = document.getElementById('cartDeliverySlot').value;
    const deliveryDateStr = typeof getFormattedDeliveryDate === 'function' ? getFormattedDeliveryDate('cartDeliveryDate') : document.getElementById('cartDeliveryDate').value;
    const paymentType = document.getElementById('cartPaymentMethod').value;
    
    let subtotal = 0;
    let productList = [];
    let itemsSnapshot = [];
    
    cartItems.forEach(item => {
        const itemTotal = item.config.calc(item.qty);
        subtotal += itemTotal;
        const displayStr = `${item.name} (${item.qty})`;
        productList.push(displayStr);
        itemsSnapshot.push({
            product: item.name,
            qty: item.qty,
            price: item.config.basePrice,
            total: itemTotal
        });
    });

    // Intercept for UPI Deep Linking
    if (paymentType.includes('Online') && !isPaymentConfirmed) {
        const upiId = '9392603808@axl';
        const upiName = 'Ayyappa Dairy Farm';
        const amount = subtotal.toFixed(2);
        
        // 1. Launch Intent
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR`;
        window.location.href = upiUrl;
        
        // 2. Show Confirmation Dialog
        document.getElementById('cart-checkout-view-inner').style.display = 'none';
        document.getElementById('cart-upi-confirm-view').style.display = 'block';
        return;
    }

    const btn = document.getElementById('cartSubmitBtn');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '⏳ Processing Order...';
    }



    const amountStr = subtotal.toString();
    const qtyStr = productList.join(', ');

    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderID = `AYY-ORD-${yyyy}${mm}${dd}-${randomNum}`;

    const actualPaymentStatus = paymentType.includes('COD') ? 'Pending' : (isPaymentConfirmed === 'Completed' ? 'Completed' : 'Pending');

    const orderDoc = {
        orderID: orderID,
        name: guestName,
        phone: guestPhone,
        membershipId: 'GUEST-USER',
        qty: qtyStr,
        items: itemsSnapshot,
        amount: amountStr,
        deliverySlot: slot,
        deliveryDate: deliveryDateStr,
        paymentType: paymentType,
        orderStatus: 'Pending',
        paymentStatus: actualPaymentStatus,
        address: guestAddress,
        area: 'NA',
        totalSubtotal: amountStr,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        placedAt: now.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    try {
        await db.collection('orders').add(orderDoc);

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🛒 Confirm Order';
        }

        const msg = `🥛 *AYYAPPA DAIRY FARM - DIRECT CART ORDER*\n\n` +
                    `✅ *Order ID:* ${orderID}\n` +
                    `👤 *Customer Name:* ${guestName}\n` +
                    `📞 *Phone:* ${guestPhone}\n` +
                    `📌 *Delivery Address:* ${guestAddress}\n` +
                    `🛒 *Products:*\n${itemsSnapshot.map(i => `  - ${i.product}: ${i.qty} x ₹${i.price} = ₹${i.total}`).join('\n')}\n\n` +
                    `🕒 *Slot:* ${slot}\n` +
                    `📅 *Delivery Date:* ${deliveryDateStr}\n` +
                    `💳 *Payment:* ${paymentType} (${actualPaymentStatus})\n` +
                    `💰 *Grand Total:* ₹${subtotal.toLocaleString('en-IN')}\n\n` +
                    `Thank you for ordering with Ayyappa Dairy Farm!`;

        const waUrl = `https://wa.me/919493207380?text=${encodeURIComponent(msg)}`;
        window.open(waUrl, '_blank');

        alert(`🎉 Thank You! Your Order has been placed successfully.\n\nOrder ID: ${orderID}\n\nRedirecting to Customer Dashboard Home page...`);

        // Close form, reset cart
        cartItems = [];
        document.getElementById('portalCartOrderForm').reset();
        showCartProducts();
        renderCart();
        
        if (typeof switchCustomerDashTab === 'function') switchCustomerDashTab('home');

    } catch (err) {
        console.error("Cart order error:", err);
        alert("Error placing order: " + err.message);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '🛒 Confirm Order';
        }
    }
}
