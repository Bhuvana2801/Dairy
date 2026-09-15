const fs = require('fs');
let text = fs.readFileSync('index.html', 'utf8');

const search = `    function setDefaultOrderDates() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const defaultDateStr = \`\${yyyy}-\${mm}-\${dd}\`;

        ['portalMonthlyOrderDate', 'portalDailyOrderDate', 'monthlyOrderDate', 'dailyOrderDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el && !el.value) {
                el.value = defaultDateStr;
            }
        });
    }`;

const replace = `    function setDefaultOrderDates() {
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
    }`;

if(text.includes(search)) {
    text = text.replace(search, replace);
    fs.writeFileSync('index.html', text);
    console.log('Replaced successfully');
} else {
    console.log('Could not find search string');
}
