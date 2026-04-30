import codecs

with codecs.open('index_utf8.html', 'r', 'utf-8') as f:
    content = f.read()

# Replace State & City HTML
old_html = '''                                <div class="booking-row">
                                    <div class="booking-field">
                                        <label for="bookState">State *</label>
                                        <div class="input-container">
                                            <span class="field-icon">🗺️</span>
                                            <select id="bookState" required onchange="updateCities()">
                                                <option value="">-- Select State --</option>
                                                <option value="Telangana">Telangana</option>
                                                <option value="Andhra Pradesh">Andhra Pradesh</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="booking-field">
                                        <label for="bookCity">City / Town *</label>
                                        <div class="input-container">
                                            <span class="field-icon">🏙️</span>
                                            <select id="bookCity" required disabled>
                                                <option value="">-- Select City --</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>'''

new_html = '''                                <div class="booking-row">
                                    <div class="booking-field">
                                        <label for="bookState">State *</label>
                                        <div class="input-container">
                                            <span class="field-icon">🗺️</span>
                                            <select id="bookState" required>
                                                <option value="Andhra Pradesh" selected>Andhra Pradesh</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="booking-field">
                                        <label for="bookCity">City / Town *</label>
                                        <div class="input-container">
                                            <span class="field-icon">🏙️</span>
                                            <select id="bookCity" required>
                                                <option value="Narasaraopet" selected>Narasaraopet</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div class="booking-field" style="margin-bottom: 1.2rem;">
                                    <label for="bookLocation">Location / Area in Narasaraopet *</label>
                                    <div class="input-container">
                                        <span class="field-icon">📍</span>
                                        <select id="bookLocation" required>
                                            <option value="">-- Select Location --</option>
                                            <option value="Arundalpet">Arundalpet</option>
                                            <option value="Prakash Nagar">Prakash Nagar</option>
                                            <option value="Ramireddy Pet">Ramireddy Pet</option>
                                            <option value="Kothapeta">Kothapeta</option>
                                            <option value="Rompicherla">Rompicherla</option>
                                            <option value="Palnadu Road">Palnadu Road</option>
                                            <option value="Bank Street">Bank Street</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>'''

content = content.replace(old_html, new_html)

# Replace JS vars in sendBookingWhatsApp
old_js1 = '''        const state = document.getElementById('bookState').value;
        const city = document.getElementById('bookCity').value;
        const address = document.getElementById('bookAddress').value;'''

new_js1 = '''        const state = document.getElementById('bookState').value;
        const city = document.getElementById('bookCity').value;
        const locationArea = document.getElementById('bookLocation').value;
        const address = document.getElementById('bookAddress').value;'''

content = content.replace(old_js1, new_js1)

# Replace JS save object
old_js2 = '''        const orderData = {
            orderID, name, phone, product, qty, date, time, city, state, address, placedAt: istTime
        };'''

new_js2 = '''        const orderData = {
            orderID, name, phone, product, qty, date, time, city, state, locationArea, address, placedAt: istTime
        };'''

content = content.replace(old_js2, new_js2)

# Replace JS whatsapp message in sendBookingWhatsApp
old_js3 = '''        const msg = `*Order has been Placed* 🥛\\n\\n` +
                    `*Order ID:* ${orderID}\\n` +
                    `*Order Time:* ${istTime} IST\\n\\n` +
                    `*Customer Name:* ${name}\\n` +
                    `*Phone:* ${phone}\\n` +
                    `*Product:* ${product}\\n` +
                    `*Quantity:* ${qty}\\n` +
                    `*Delivery Date:* ${date}\\n` +
                    `*Delivery Time:* ${time}\\n` +
                    `*Location:* ${city}, ${state}\\n` +
                    `*Address:* ${address}\\n\\n` +'''

new_js3 = '''        const msg = `✅ *Order has been Placed* 🥛\\n\\n` +
                    `*Order ID:* ${orderID}\\n` +
                    `*Order Time:* ${istTime} IST\\n\\n` +
                    `*Customer Name:* ${name}\\n` +
                    `*Phone:* ${phone}\\n` +
                    `*Product:* ${product}\\n` +
                    `*Quantity:* ${qty}\\n` +
                    `*Delivery Date:* ${date}\\n` +
                    `*Delivery Time:* ${time}\\n` +
                    `*City/State:* ${city}, ${state}\\n` +
                    `*Location Area:* ${locationArea}\\n` +
                    `*Address:* ${address}\\n\\n` +'''

content = content.replace(old_js3, new_js3)

# Replace JS reset form
old_js4 = '''        document.getElementById('bookingForm').reset();
        document.getElementById('bookCity').disabled = true;
    }'''

new_js4 = '''        document.getElementById('bookingForm').reset();
    }'''

content = content.replace(old_js4, new_js4)

# Replace JS resendOrderToWhatsApp
old_js5 = '''        const msg = `*Order has been Placed* 🥛\\n\\n` +
                    `*Order ID:* ${order.orderID}\\n` +
                    `*Original Time:* ${order.placedAt} IST\\n\\n` +
                    `*Customer Name:* ${order.name}\\n` +
                    `*Phone:* ${order.phone}\\n` +
                    `*Product:* ${order.product}\\n` +
                    `*Quantity:* ${order.qty}\\n` +
                    `*Delivery Date:* ${order.date}\\n` +
                    `*Delivery Time:* ${order.time}\\n` +
                    `*Location:* ${order.city}, ${order.state}\\n` +
                    `*Address:* ${order.address}\\n\\n` +'''

new_js5 = '''        const msg = `✅ *Order has been Placed* 🥛\\n\\n` +
                    `*Order ID:* ${order.orderID}\\n` +
                    `*Original Time:* ${order.placedAt} IST\\n\\n` +
                    `*Customer Name:* ${order.name}\\n` +
                    `*Phone:* ${order.phone}\\n` +
                    `*Product:* ${order.product}\\n` +
                    `*Quantity:* ${order.qty}\\n` +
                    `*Delivery Date:* ${order.date}\\n` +
                    `*Delivery Time:* ${order.time}\\n` +
                    `*City/State:* ${order.city}, ${order.state}\\n` +
                    `*Location Area:* ${order.locationArea || 'N/A'}\\n` +
                    `*Address:* ${order.address}\\n\\n` +'''

content = content.replace(old_js5, new_js5)

with codecs.open('index.html', 'w', 'utf-8') as f:
    f.write(content)
print("Replaced content safely!")
