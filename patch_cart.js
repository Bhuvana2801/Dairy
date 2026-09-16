const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf-8');

// Replacements
let newContent = content.replace('<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css">\n    <link rel="stylesheet" href="cart.css">');
newContent = newContent.replace('<script src="main.js"></script>', '<script src="cart.js"></script>\n    <script src="main.js"></script>');

const startStr = '<!-- TAB 3: ORDER NOW -->';
const endStr = '<!-- TAB 4: CONTACT -->';
const startIndex = newContent.indexOf(startStr);
const endIndex = newContent.indexOf(endStr);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find delimiters.");
    process.exit(1);
}

const replacement = `<!-- TAB 3: ORDER NOW -->
                <div id="cdash-panel-ordernow" class="cdash-tab-panel" style="display: none;">
                    
                    <div id="cart-main-view">
                        <div class="cart-header">
                            <div>
                                <h4>🛒 Your Shopping Cart</h4>
                                <p style="margin: 0; font-size: 0.85rem; color: rgba(255,255,255,0.9); margin-top: 2px;">Fresh dairy products, delivered to your doorstep.</p>
                            </div>
                            <div class="cart-count" id="cart-header-count">Cart (0)</div>
                        </div>

                        <!-- Product Selection Array -->
                        <div class="products-section-header">Select Products</div>
                        <div class="cart-product-grid">
                            <!-- Product 1 -->
                            <div class="cart-product-card">
                                <div style="height: 140px; border-radius: 8px; overflow: hidden; margin-bottom: 0.8rem;">
                                    <img src="images/buffalo_milk.jpg" alt="Pure Buffalo Milk" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="cart-product-info">
                                    <h5>Pure Buffalo Milk</h5>
                                    <p>Fresh • Pure • Hygienically Handled</p>
                                    <div class="cart-product-price">₹100 / Litre</div>
                                    <select id="cartQty-milk" class="cart-product-select">
                                        <option value="0" selected disabled>Select Quantity</option>
                                        <option value="0.5">500 ml — ₹50</option>
                                        <option value="1">1 Litre — ₹100</option>
                                        <option value="2">2 Litres — ₹200</option>
                                        <option value="3">3 Litres — ₹300</option>
                                        <option value="4">4 Litres — ₹400</option>
                                        <option value="5">5 Litres — ₹500</option>
                                        <option value="6">6 Litres — ₹600</option>
                                        <option value="7">7 Litres — ₹700</option>
                                        <option value="8">8 Litres — ₹800</option>
                                        <option value="9">9 Litres — ₹900</option>
                                        <option value="10">10 Litres — ₹1,000</option>
                                    </select>
                                    <button class="cart-add-btn" onclick="addToCart('milk')">🛒 Add to Cart</button>
                                </div>
                            </div>
                            <!-- Product 2 -->
                            <div class="cart-product-card">
                                <div style="height: 140px; border-radius: 8px; overflow: hidden; margin-bottom: 0.8rem;">
                                    <img src="images/fresh_curd.jpg" alt="Fresh Curd" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="cart-product-info">
                                    <h5>Fresh Curd</h5>
                                    <p>Fresh • Creamy • Naturally Prepared</p>
                                    <div class="cart-product-price">₹60 / Kg</div>
                                    <select id="cartQty-curd" class="cart-product-select">
                                        <option value="0" selected disabled>Select Quantity</option>
                                        <option value="0.5">500 g — ₹30</option>
                                        <option value="1">1 Kg — ₹60</option>
                                        <option value="2">2 Kg — ₹120</option>
                                        <option value="3">3 Kg — ₹180</option>
                                        <option value="4">4 Kg — ₹240</option>
                                        <option value="5">5 Kg — ₹300</option>
                                        <option value="6">6 Kg — ₹360</option>
                                        <option value="7">7 Kg — ₹420</option>
                                        <option value="8">8 Kg — ₹480</option>
                                        <option value="9">9 Kg — ₹540</option>
                                        <option value="10">10 Kg — ₹600</option>
                                    </select>
                                    <button class="cart-add-btn" onclick="addToCart('curd')">🛒 Add to Cart</button>
                                </div>
                            </div>
                            <!-- Product 3 -->
                            <div class="cart-product-card">
                                <div style="height: 140px; border-radius: 8px; overflow: hidden; margin-bottom: 0.8rem;">
                                    <img src="images/pure_ghee.jpg" alt="Original Ghee" style="width: 100%; height: 100%; object-fit: cover;">
                                </div>
                                <div class="cart-product-info">
                                    <h5>Original Ghee</h5>
                                    <p>Pure • Rich • Traditional Taste</p>
                                    <div class="cart-product-price">₹600 / Litre</div>
                                    <select id="cartQty-ghee" class="cart-product-select">
                                        <option value="0" selected disabled>Select Quantity</option>
                                        <option value="0.5">500 ml — ₹300</option>
                                        <option value="1">1 Litre — ₹600</option>
                                        <option value="2">2 Litres — ₹1,200</option>
                                        <option value="3">3 Litres — ₹1,800</option>
                                        <option value="4">4 Litres — ₹2,400</option>
                                        <option value="5">5 Litres — ₹3,000</option>
                                        <option value="6">6 Litres — ₹3,600</option>
                                        <option value="7">7 Litres — ₹4,200</option>
                                        <option value="8">8 Litres — ₹4,800</option>
                                        <option value="9">9 Litres — ₹540</option>
                                        <option value="10">10 Litres — ₹6,000</option>
                                    </select>
                                    <button class="cart-add-btn" onclick="addToCart('ghee')">🛒 Add to Cart</button>
                                </div>
                            </div>
                        </div>

                        <!-- Cart Array Mapping -->
                        <div id="cart-empty-state" class="cart-empty-state">
                            <span class="icon">🛒</span>
                            <h3>Your Cart is Empty</h3>
                            <p>Add fresh dairy products to your cart and place your order.</p>
                        </div>
                        
                        <div id="cart-active-layout" class="cart-layout" style="display: none;">
                            <!-- Left: Cart Items -->
                            <div>
                                <div class="products-section-header">Selected Cart Items</div>
                                <div class="cart-items-list" id="cart-items-list">
                                    <!-- Rendered dynamically -->
                                </div>
                            </div>

                            <!-- Right: Order Summary -->
                            <div>
                                <div class="cart-summary-card">
                                    <h4>Order Summary</h4>
                                    <div class="cart-summary-row">
                                        <span>Subtotal</span>
                                        <span id="cart-summary-subtotal" style="font-weight: 700;">₹0</span>
                                    </div>
                                    <div class="cart-summary-row" style="color: #16a34a;">
                                        <span>Delivery Charge</span>
                                        <span style="font-weight: 700;">FREE</span>
                                    </div>
                                    <p style="font-size: 0.75rem; color: #1b5e20; margin: 0.3rem 0; font-weight: 600;">🚚 Free delivery available in Narasaraopet</p>
                                    
                                    <div class="cart-summary-total">
                                        <span>Total Amount</span>
                                        <span id="cart-summary-final-amt">₹0</span>
                                    </div>
                                    <button type="button" class="cart-checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout →</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Checkout Section -->
                    <div id="cart-checkout-view">
                        <div class="cart-header" style="cursor: pointer;" onclick="showCartProducts()">
                            <div>
                                <h4>🛒 Return to Cart</h4>
                            </div>
                            <div class="cart-count">← Back</div>
                        </div>
                        
                        <form id="portalCartOrderForm" onsubmit="handleDynamicCartSubmit(event)">
                            <div style="background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e0eee0; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                                
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
                                    <div class="modal-input-group" style="margin-bottom:0;">
                                        <label style="font-weight: 700; color: #333; font-size: 0.88rem;">Delivery Slot</label>
                                        <select id="cartDeliverySlot" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.88rem;">
                                            <option value="No Preference (Any Time)" selected>⚪ Optional / Any Time</option>
                                            <option value="Morning (7:00 AM – 9:00 AM)">🌅 Morning (7:00 AM – 9:00 AM)</option>
                                            <option value="Evening (7:00 PM – 9:00 PM)">🌆 Evening (7:00 PM – 9:00 PM)</option>
                                        </select>
                                    </div>
                                    <div class="modal-input-group" style="margin-bottom:0;">
                                        <label style="font-weight: 700; color: #333; font-size: 0.88rem;">Delivery Date <span style="color:red;">*</span></label>
                                        <input type="date" id="cartDeliveryDate" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.88rem;" required>
                                    </div>
                                </div>
                                <div class="modal-input-group" style="margin-bottom: 1.2rem;">
                                    <label style="font-weight: 700; color: #333; font-size: 0.88rem;">Payment System <span style="color:red;">*</span></label>
                                    <select id="cartPaymentMethod" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.92rem; font-weight:700;" required>
                                        <option value="Cash On Delivery" selected>💵 Cash on Delivery (COD)</option>
                                        <option value="Online Upfront Payment (UPI/Card)">💳 Online Payment (UPI / GPay / PhonePe / Card)</option>
                                    </select>
                                </div>
                                <button type="submit" id="cartSubmitBtn" style="width:100%; padding:1rem; font-size:1.1rem; font-weight:800; border-radius:50px; cursor:pointer; background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%); color:white; border:none; box-shadow:0 4px 15px rgba(26,92,42,0.35);">
                                    🛒 Confirm Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                `;

newContent = newContent.substring(0, startIndex) + replacement + newContent.substring(endIndex);
fs.writeFileSync('index.html', newContent);
console.log("Successfully replaced cart section.");
