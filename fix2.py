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

# Add locationArea to JS
content = content.replace("const city = document.getElementById('bookCity').value;", "const city = document.getElementById('bookCity').value;\n        const locationArea = document.getElementById('bookLocation').value;")

content = content.replace("city, state, address, placedAt: istTime", "city, state, locationArea, address, placedAt: istTime")

content = content.replace("`*Location:* ${city}, ${state}\\n` +", "`*City/State:* ${city}, ${state}\\n` +\n                    `*Location Area:* ${locationArea}\\n` +")

content = content.replace("`*Location:* ${order.city}, ${order.state}\\n` +", "`*City/State:* ${order.city}, ${order.state}\\n` +\n                    `*Location Area:* ${order.locationArea || 'N/A'}\\n` +")

content = content.replace("`*Order has been Placed* 🥛", "`✅ *Order has been Placed* 🥛")

content = content.replace("document.getElementById('bookCity').disabled = true;", "")

with codecs.open('index.html', 'w', 'utf-8') as f:
    f.write(content)
print("Finished fixing encoding and emojis!")
