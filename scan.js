const fs = require('fs');
const lines = fs.readFileSync('c:/Users/user/OneDrive/Desktop/Dairy-main/Dairy-main/index.html', 'utf8').split('\n');
lines.forEach((line, i) => {
    if (/Registration Form|WhatsApp|showPage\(['"]order['"]\)|whatsapp-fab|page-order/i.test(line)) {
        console.log(`Line ${i + 1}: ${line.trim()}`);
    }
});
