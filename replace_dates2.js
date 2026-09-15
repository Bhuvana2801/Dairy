const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

const regex = /function setDefaultOrderDates\(\) \{[\s\S]*?\}\n/m;
const replacement = `function setDefaultOrderDates() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const defaultDateStr = \`\${yyyy}-\${mm}-\${dd}\`;

        ['portalMonthlyOrderDate', 'portalDailyOrderDate', 'monthlyOrderDate', 'dailyOrderDate', 'orderDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value) {
                el.value = defaultDateStr;
                el.min = defaultDateStr;
            }
        });
    }
`;

if(regex.test(text)) {
    text = text.replace(regex, replacement);
    fs.writeFileSync('index.html', text);
    console.log('Regex Replaced successfully');
} else {
    console.log('Regex Could not find search string');
}
