const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const startTag = '<!-- Logged In Customer Summary Header -->';
const endTag = '<!-- Order Confirmation Message Box -->';

const startIndex = html.indexOf(startTag);
const endIndex = html.indexOf(endTag);

const newFormHtml = `
                            <!-- Subscription Type Setup (Hidden input defaulting to Daily) -->
                            <form id="masterOrderForm" onsubmit="handleMasterOrderSubmit(event)">
                                <!-- 1. Customer Details -->
                                <div style="background: #f8fafc; border: 1.5px solid #e2e8f0; padding: 1.2rem; border-radius: 14px; margin-bottom: 1.5rem;">
                                    <h3 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 800;">👤 1. Customer Details</h3>
                                    
                                    <div class="modal-input-group" style="margin-bottom: 1rem;">
                                        <label for="orderName" style="font-weight: 700; color: #333;">Full Name <span style="color:red;">*</span></label>
                                        <input type="text" id="orderName" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" placeholder="Enter your full name" required>
                                    </div>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderPhone" style="font-weight: 700; color: #333;">Phone Number <span style="color:red;">*</span></label>
                                            <input type="tel" id="orderPhone" oninput="syncWhatsAppPhone()" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" placeholder="10-digit number" pattern="[0-9]{10}" required>
                                        </div>
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderWhatsapp" style="font-weight: 700; color: #333;">WhatsApp Number <span style="color:red;">*</span></label>
                                            <input type="tel" id="orderWhatsapp" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" placeholder="10-digit number" pattern="[0-9]{10}" required>
                                        </div>
                                    </div>
                                </div>

                                <!-- 2. Subscription Type -->
                                <div style="margin-bottom: 1.5rem;">
                                    <div class="modal-input-group">
                                        <label for="orderSubscriptionType" style="font-weight: 700; color: #333;">2. Subscription Type <span style="color:red;">*</span></label>
                                        <select id="orderSubscriptionType" style="width:100%; padding:0.85rem; border:1.5px solid #2e7d32; border-radius:10px; font-size:1rem; font-weight:800; background: #e8f5e9; color: #1b5e20;" required>
                                            <option value="Daily" selected>📅 Daily (One Order Per Calendar Day)</option>
                                            <option value="One-Time">🛍️ One-Time Order</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- 3. Products -->
                                <div style="border: 1.5px solid #e2e8f0; padding: 1.2rem; border-radius: 14px; margin-bottom: 1.5rem;">
                                    <h3 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 800;">🛒 3. Select Products</h3>
                                    
                                    <div style="display: grid; gap: 1rem;">
                                        <!-- Buffalo Milk -->
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                                            <div>
                                                <div style="font-weight: 800; color: #333;">🥛 Buffalo Milk</div>
                                                <div style="font-size: 0.85rem; color: #666;">₹100 / Litre</div>
                                            </div>
                                            <select id="orderQtyMilk" onchange="updateOrderTotalPricing()" style="padding:0.6rem; border:1.5px solid #ccc; border-radius:8px; font-size:0.9rem; font-weight:700; width: 120px;">
                                                <option value="0">None</option>
                                                <option value="0.5">500 ml</option>
                                                <option value="1">1 Litre</option>
                                                <option value="2">2 Litres</option>
                                                <option value="3">3 Litres</option>
                                                <option value="4">4 Litres</option>
                                                <option value="5">5 Litres</option>
                                                <option value="6">6 Litres</option>
                                                <option value="7">7 Litres</option>
                                                <option value="8">8 Litres</option>
                                                <option value="9">9 Litres</option>
                                                <option value="10">10 Litres</option>
                                            </select>
                                        </div>
                                        
                                        <!-- Fresh Curd -->
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 1px solid #eee;">
                                            <div>
                                                <div style="font-weight: 800; color: #333;">🥣 Fresh Curd</div>
                                                <div style="font-size: 0.85rem; color: #666;">₹60 / Kg</div>
                                            </div>
                                            <select id="orderQtyCurd" onchange="updateOrderTotalPricing()" style="padding:0.6rem; border:1.5px solid #ccc; border-radius:8px; font-size:0.9rem; font-weight:700; width: 120px;">
                                                <option value="0">None</option>
                                                <option value="0.5">500 g</option>
                                                <option value="1">1 Kg</option>
                                                <option value="2">2 Kg</option>
                                                <option value="3">3 Kg</option>
                                                <option value="4">4 Kg</option>
                                                <option value="5">5 Kg</option>
                                                <option value="6">6 Kg</option>
                                                <option value="7">7 Kg</option>
                                                <option value="8">8 Kg</option>
                                                <option value="9">9 Kg</option>
                                                <option value="10">10 Kg</option>
                                            </select>
                                        </div>
                                        
                                        <!-- Buffalo Ghee -->
                                        <div style="display: flex; justify-content: space-between; align-items: center;">
                                            <div>
                                                <div style="font-weight: 800; color: #333;">🏺 Buffalo Ghee (Original)</div>
                                                <div style="font-size: 0.85rem; color: #666;">₹600 / Litre</div>
                                            </div>
                                            <select id="orderQtyGhee" onchange="updateOrderTotalPricing()" style="padding:0.6rem; border:1.5px solid #ccc; border-radius:8px; font-size:0.9rem; font-weight:700; width: 120px;">
                                                <option value="0">None</option>
                                                <option value="0.5">500 ml</option>
                                                <option value="1">1 Litre</option>
                                                <option value="2">2 Litres</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div id="productSelectError" style="color: #e53e3e; font-size: 0.85rem; font-weight: 700; display: none; margin-top: 0.8rem;">⚠️ Please select at least one product.</div>
                                </div>

                                <!-- 4. Delivery Location -->
                                <div style="border: 1.5px solid #e2e8f0; padding: 1.2rem; border-radius: 14px; margin-bottom: 1.5rem;">
                                    <h3 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 800;">📍 4. Delivery Location</h3>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 1rem;">
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderCity" style="font-weight: 700; color: #333;">City</label>
                                            <input type="text" id="orderCity" value="Narasaraopet" readonly style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem; background:#f0f0f0; color:#555;">
                                        </div>
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderArea" style="font-weight: 700; color: #333;">Area <span style="color:red;">*</span></label>
                                            <select id="orderArea" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" required>
                                                <option value="" disabled selected>Select Area</option>
                                                <option value="Arundelpet">Arundelpet</option>
                                                <option value="Kothapeta">Kothapeta</option>
                                                <option value="Prakash Nagar">Prakash Nagar</option>
                                                <option value="DSC Colony">DSC Colony</option>
                                                <option value="Ramireddy Peta">Ramireddy Peta</option>
                                                <option value="Buram Peta">Buram Peta</option>
                                                <option value="NGO Colony">NGO Colony</option>
                                                <option value="Vinukonda Road">Vinukonda Road</option>
                                                <option value="RTO Centre">RTO Centre</option>
                                                <option value="Stadium">Stadium</option>
                                                <option value="Clock Centre">Clock Centre</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="modal-input-group" style="margin-bottom: 0.8rem;">
                                        <label for="orderAddressHouse" style="font-weight: 700; color: #333;">House / Door Number <span style="color:red;">*</span></label>
                                        <input type="text" id="orderAddressHouse" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" required>
                                    </div>
                                    
                                    <div class="modal-input-group" style="margin-bottom: 0.8rem;">
                                        <label for="orderAddressStreet" style="font-weight: 700; color: #333;">Street / Road <span style="color:red;">*</span></label>
                                        <input type="text" id="orderAddressStreet" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" required>
                                    </div>
                                    
                                    <div class="modal-input-group" style="margin-bottom: 0;">
                                        <label for="orderAddressLandmark" style="font-weight: 700; color: #333;">Landmark (Optional)</label>
                                        <input type="text" id="orderAddressLandmark" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;">
                                    </div>
                                </div>

                                <!-- 5. Delivery Date & Time -->
                                <div style="border: 1.5px solid #e2e8f0; padding: 1.2rem; border-radius: 14px; margin-bottom: 1.5rem;">
                                    <h3 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 800;">🗓️ 5. Delivery Schedule</h3>
                                    
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem;">
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderDate" style="font-weight: 700; color: #333;">Start Date <span style="color:red;">*</span></label>
                                            <input type="date" id="orderDate" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" required>
                                        </div>
                                        <div class="modal-input-group" style="margin-bottom:0;">
                                            <label for="orderSlot" style="font-weight: 700; color: #333;">Delivery Time <span style="color:red;">*</span></label>
                                            <select id="orderSlot" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem;" required>
                                                <option value="Morning (7:00 AM – 9:00 AM)" selected>🌅 Morning (7:00 AM – 9:00 AM)</option>
                                                <option value="Evening (7:00 PM – 9:00 PM)">🌆 Evening (7:00 PM – 9:00 PM)</option>
                                                <option value="Morning & Evening">🌅🌆 Morning & Evening</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 6. Payment -->
                                <div style="border: 1.5px solid #e2e8f0; padding: 1.2rem; border-radius: 14px; margin-bottom: 1.5rem;">
                                    <h3 style="color: var(--primary-color); font-size: 1.1rem; margin-bottom: 1rem; font-weight: 800;">💳 6. Payment System</h3>
                                    <div class="modal-input-group" style="margin-bottom: 0;">
                                        <label for="orderPayment" style="font-weight: 700; color: #333;">Payment Method <span style="color:red;">*</span></label>
                                        <select id="orderPayment" style="width:100%; padding:0.85rem; border:1.5px solid #ccc; border-radius:10px; font-size:0.95rem; font-weight:700;" required>
                                            <option value="UPI" selected>📱 Online Payment (UPI) - Preferred</option>
                                            <option value="COD">💵 Cash on Delivery</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Dynamic Live Price Summary Box -->
                                <div id="masterPriceSummaryBox" style="background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 1.2rem; margin-bottom: 1.5rem;">
                                    <div style="font-size: 0.85rem; font-weight: 800; color: #1b5e20; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.6rem; display: flex; justify-content: space-between;">
                                        <span>💰 Order Summary</span>
                                    </div>
                                    <div style="font-size: 0.9rem; line-height: 1.6; color: #334155;">
                                        <div style="display: flex; justify-content: space-between;">
                                            <span>Subtotal (Products):</span>
                                            <span id="masterSummarySubtotal" style="font-weight: 700;">₹0</span>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; color: #16a34a;">
                                            <span>Delivery Charge:</span>
                                            <span style="font-weight: 700;">FREE (₹0)</span>
                                        </div>
                                        <div style="border-top: 1.5px dashed #cbd5e1; margin-top: 0.5rem; padding-top: 0.5rem; display: flex; justify-content: space-between; font-size: 1.25rem; font-weight: 800; color: #1b5e20;">
                                            <span>Grand Total:</span>
                                            <span id="masterSummaryFinalAmt">₹0</span>
                                        </div>
                                        <div style="font-size: 0.75rem; color: #64748b; margin-top: 0.4rem; text-align: right;" id="masterSummaryFrequency">Per Order</div>
                                    </div>
                                </div>

                                <button type="submit" id="masterSubmitBtn" class="btn btn-primary" style="width:100%; padding:1rem; font-size:1.15rem; font-weight:800; border-radius:50px; cursor:pointer; background: linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%); color:white; border:none; box-shadow:0 6px 20px rgba(26,92,42,0.35); transition: 0.3s;">
                                    💳 Confirm Order
                                </button>
                                
                                <div id="orderErrorMsg" style="color: #e53e3e; font-size: 0.9rem; font-weight: 700; text-align: center; margin-top: 1rem; display: none;">
                                    Unable to place your order. Please try again.
                                </div>
                            </form>
`;

if (startIndex > -1 && endIndex > -1) {
    html = html.substring(0, startIndex) + newFormHtml + html.substring(endIndex);
    fs.writeFileSync('index.html', html);
    console.log('Successfully replaced order form HTML');
} else {
    console.log('Could not find tags: ' + startIndex + ' ' + endIndex);
}
