const admin = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const app = express();

// production environment
if(process.env.GCP_PROJECT) {
    admin.initializeApp(functions.config().firebase);
}
else {
    // development environment
    let serviceAccount = require('./firebaseadminsdk.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

let db = admin.firestore();

app.get('/user', async (req, res) => {
    let doc = await db.collection('users').doc('alovelace').get()
    res.json(doc.exists ? doc.data() : null)
})

// Create "main" function to host all other top-level functions
const main = express();
main.use('/api', app);
exports.main = functions.https.onRequest(main);