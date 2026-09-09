const admin = require('firebase-admin');
const moment = require('moment-timezone');

// You must generate a Service Account Key in Firebase Console 
// (Project Settings -> Service Accounts -> Generate New Private Key)
// Then set the path or parse the JSON here:
// const serviceAccount = require('./serviceAccountKey.json');
// 
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const db = admin.firestore();

/**
 * AUTOMATIC RENEWAL SCHEDULER
 * This function processes all active Daily subscriptions and generates 
 * the next sequence order specifically tied to the India Standard Time (IST) calendar day.
 */
async function processDailyRenewals() {
    console.log("=== STARTING DAILY RENEWAL SCHEDULER ===");
    try {
        // 1. Timezone: Asia/Kolkata
        const todayIST = moment().tz('Asia/Kolkata').format('YYYY-MM-DD');
        console.log(`Current IST Date: ${todayIST}`);

        // 2. Fetch ACTIVE Daily Subscriptions
        const subsSnapshot = await db.collection('subscriptions')
            .where('status', '==', 'ACTIVE')
            .get();

        if (subsSnapshot.empty) {
            console.log("No ACTIVE daily subscriptions found.");
            return;
        }

        console.log(`Found ${subsSnapshot.size} ACTIVE subscriptions.`);

        let processedCount = 0;

        for (const doc of subsSnapshot.docs) {
            const sub = doc.data();
            
            // UNIQUE Constraint check: One order per Subscription + Delivery Date
            const existingOrder = await db.collection('orders')
                .where('subscriptionId', '==', sub.subscriptionId)
                .where('deliveryDate', '==', todayIST)
                .get();

            if (!existingOrder.empty) {
                console.log(`[SKIP] Subscription ${sub.subscriptionId} already has an order for ${todayIST}.`);
                continue;
            }

            // Generate Order ID Atomically using Global Sequence
            const orderNum = await db.runTransaction(async (t) => {
                const seqRef = db.collection('metadata').doc('orderSequence');
                const docSnap = await t.get(seqRef);
                let nextId = 2800; // Application Global Start
                if (docSnap.exists && docSnap.data().lastId) {
                    nextId = docSnap.data().lastId + 1;
                }
                t.set(seqRef, { lastId: nextId }, { merge: true });
                return nextId;
            });
            const globalOrderId = `ADFD${orderNum}`;

            // Calculate current prices
            let subtotal = 0;
            const items = sub.items || [];
            
            const orderDoc = {
                orderID: globalOrderId,
                subscriptionId: sub.subscriptionId,
                orderType: 'Daily',
                name: sub.name,
                phone: sub.phone,
                wa: sub.wa,
                products: items.map(i => `${i.product} (${i.qty})`).join(', '),
                items: items,
                subtotal: items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toString(),
                total: items.reduce((acc, curr) => acc + (curr.price * curr.qty), 0).toString(),
                deliveryDate: todayIST,
                deliverySlot: sub.slot,
                city: 'Narasaraopet',
                area: sub.area,
                address: sub.address,
                paymentMethod: 'Prepaid Daily', 
                paymentStatus: 'Pending',
                orderStatus: 'Confirmed',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            };

            await db.collection('orders').add(orderDoc);
            console.log(`[CREATE] Order ${globalOrderId} created for Subscription ${sub.subscriptionId} on ${todayIST}`);
            processedCount++;
        }

        console.log(`=== DAILY RENEWAL COMPLETE. Generated ${processedCount} orders. ===`);

    } catch (err) {
        console.error("Scheduler failed:", err);
    }
}

// If exported as a Vercel Serverless Function:
module.exports = async (req, res) => {
    // Only allow authorized cron requests (Vercel Secure Cron)
    // if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    //    return res.status(401).end('Unauthorized');
    // }
    
    await processDailyRenewals();
    res.status(200).send('Cron Job Executed.');
};

// If testing locally
// processDailyRenewals();
