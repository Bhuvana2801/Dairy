const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = "// 2. Handle Special Sections";

const newStr = `// 2. Handle Special Sections
        if (section === 'offer_claims') {
            const offSec = document.getElementById('offer-claims-section');
            if (offSec) offSec.style.display = 'block';
            document.getElementById('dashHeading').textContent = '15 Days Plan Leads';
            document.getElementById('backBtn').style.display = 'inline-block';
            document.getElementById('exportBtn').style.display = 'none';
            fetchAdminOfferClaims();
            return;
        }`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, newStr);
    fs.writeFileSync('index.html', html);
    console.log("Success replacing JS section");
} else {
    console.log("Failed to find target");
}
