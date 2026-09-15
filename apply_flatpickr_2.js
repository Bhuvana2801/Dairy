const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const headTarget = '<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>';
const headReplace = headTarget + '\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">\n    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>';

const funcTarget = `    function setDefaultOrderDates() {
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

const funcReplace = `    function setDefaultOrderDates() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        const defaultDateStr = \`\${yyyy}-\${mm}-\${dd}\`;

        ['portalMonthlyOrderDate', 'portalDailyOrderDate', 'monthlyOrderDate', 'dailyOrderDate', 'orderDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (typeof flatpickr !== 'undefined') {
                    flatpickr(el, {
                        altInput: true,
                        altFormat: "d/m/Y",
                        dateFormat: "Y-m-d",
                        defaultDate: tomorrow,
                        minDate: tomorrow,
                        maxDate: tomorrow,
                        disableMobile: "true"
                    });
                } else if (!el.value) {
                    el.value = defaultDateStr;
                    el.min = defaultDateStr;
                    el.max = defaultDateStr;
                }
            }
        });
    }`;

if (html.includes(headTarget) && html.includes(funcTarget)) {
    html = html.replace(headTarget, headReplace);
    html = html.replace(funcTarget, funcReplace);
    fs.writeFileSync('index.html', html);
    console.log('Success');
} else {
    console.log('Target not found');
}
