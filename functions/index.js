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

app.get('/', async (req, res) => {
    res.json(`Welcome to ${req.originalUrl}`)
})

/*

let citiesRef = db.collection('cities');
let query = citiesRef.where('capital', '==', true).get()
.then(snapshot => {
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }  

    snapshot.forEach(doc => {
        console.log(doc.id, '=>', doc.data());
    });
})
.catch(err => {
    console.log('Error getting documents', err);
});


*/

app.get('/api/catalog/list/term', async (req, res) => {
    // SELECT DISTINCT TERM_CODE FROM records ORDER BY TERM_CODE ASC
    
    res.json('Not yet implemented')
})

app.get('/api/catalog/list/dept', async (req, res) => {
    // SELECT DISTINCT DEPT FROM records ORDER BY DEPT ASC

    res.json('Not yet implemented')
})

app.get('/api/catalog/list/catalog_nbr', async (req, res) => {
    // SELECT DISTINCT CATALOG_NBR FROM records ORDER BY DEPT ASC

    res.json('Not yet implemented')
})

app.get('/api/catalog/list/courses/:term/:dept', async (req, res) => {
    if(request.params.term.toLowerCase() === 'all') {
        if(request.params.dept.toLowerCase() === 'all') {
            // SELECT DISTINCT DEPT, CATALOG_NBR FROM records ORDER BY DEPT ASC, CATALOG_NBR ASC')).map(a => `${a['DEPT']} ${a['CATALOG_NBR']}`)
        }
        else {
            // 'SELECT DISTINCT CATALOG_NBR FROM records WHERE DEPT=? ORDER BY CATALOG_NBR ASC', [request.params.dept])).map(a => a['CATALOG_NBR'])
        }
    }
    else {
        // SELECT DISTINCT CATALOG_NBR FROM records WHERE TERM_CODE=? AND DEPT=? ORDER BY CATALOG_NBR ASC', [request.params.term, request.params.dept])).map(a => a['CATALOG_NBR'])
    }
    res.json('Not yet implemented')
})

app.get('/api/catalog/list/sections/:term/:dept/:course', async (req, res) => {
    if(request.params.term.toLowerCase() === 'all') {
        // SELECT DISTINCT CLASS_SECTION FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC', [request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
    }
    else {
        // SELECT DISTINCT CLASS_SECTION FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
    }
    res.json('Not yet implemented')
})

app.get('/api/table/:term/:dept/:course/:section', async (req, res) => {
    // SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? AND CLASS_SECTION=? ORDER BY TERM_CODE ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course, request.params.section]))
    res.json('Not yet implemented')
})

app.get('/api/table/:term/:dept/:course', async (req, res) => {
    if(request.params.term.toLowerCase() === "all") {
        // SELECT * FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC', [request.params.dept, request.params.course]))
    }
    else {
        // SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course]))
    }
    res.json('Not yet implemented')
})

// Create "main" function to host all other top-level functions
const main = express();
main.use('/api', app);
exports.main = functions.https.onRequest(main);