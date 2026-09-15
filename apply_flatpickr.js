const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Inject CDN in head
const headTarget = `    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\r
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\r
</head>`;

const headReplacement = `    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\r
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\r
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">\r
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>\r
</head>`;

// Fallback without \r just in case
const headTarget2 = `    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n</head>`;
const headReplacement2 = `    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>\n    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>\n    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">\n    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>\n</head>`;


// 2. Replace setDefaultOrderDates
const funcTargetRegex = /function setDefaultOrderDates\(\) \{[\s\S]*?\}\n\r?\n\r?    function getFormattedDeliveryDate/m;

const funcReplacement = `function setDefaultOrderDates() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        ['portalMonthlyOrderDate', 'portalDailyOrderDate', 'monthlyOrderDate', 'dailyOrderDate', 'orderDate'].forEach(id => {
            const el = document.getElementById(id);
            if (el && typeof flatpickr !== 'undefined' && !el._flatpickr) {
                flatpickr(el, {
                    altInput: true,
                    altFormat: "d/m/Y",
                    dateFormat: "Y-m-d",
                    defaultDate: tomorrow,
                    minDate: tomorrow,
                    maxDate: tomorrow,
                    disableMobile: "true"
                });
            } else if (el && typeof flatpickr === 'undefined') {
                // Fallback if Flatpickr fails to load
                const yyyy = tomorrow.getFullYear();
                const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                const dd = String(tomorrow.getDate()).padStart(2, '0');
                const defaultDateStr = \`\${yyyy}-\${mm}-\${dd}\`;
                if (!el.value) {
                    el.value = defaultDateStr;
                    el.min = defaultDateStr;
                }
            }
        });
    }

    function getFormattedDeliveryDate`;

let changed = false;

if (html.includes(headTarget)) {
    html = html.replace(headTarget, headReplacement);
    changed = true;
} else if (html.includes(headTarget2)) {
    html = html.replace(headTarget2, headReplacement2);
    changed = true;
} else {
    console.log('Could not find header anchor.');
}

if (funcTargetRegex.test(html)) {
    html = html.replace(funcTargetRegex, funcReplacement);
    changed = true;
} else {
    console.log('Could not find setDefaultOrderDates.');
}

if (changed) {
    fs.writeFileSync('index.html', html);
    console.log('Successfully updated index.html for flatpickr');
}
