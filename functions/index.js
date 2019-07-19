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

app.get('/', async (req, res) => {
    return res.json(`Welcome to ${req.originalUrl}`)
})

app.get('/catalog/list/term', async (req, res) => {
    // SELECT DISTINCT TERM_CODE FROM records ORDER BY TERM_CODE ASC
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    return res.json('Not yet implemented')
})

app.get('/catalog/list/dept', async (req, res) => {
    // SELECT DISTINCT DEPT FROM records ORDER BY DEPT ASC
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    return res.json('Not yet implemented')
})

app.get('/catalog/list/catalog_nbr', async (req, res) => {
    // SELECT DISTINCT CATALOG_NBR FROM records ORDER BY DEPT ASC
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    return res.json('Not yet implemented')
})

app.get('/catalog/list/courses/:term/:dept', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
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
    return res.json('Not yet implemented')
})

app.get('/catalog/list/sections/:term/:dept/:course', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    if(request.params.term.toLowerCase() === 'all') {
        // SELECT DISTINCT CLASS_SECTION FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC', [request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
    }
    else {
        // SELECT DISTINCT CLASS_SECTION FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY CATALOG_NBR ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course])).map(a => a['CLASS_SECTION'])
    }
    return res.json('Not yet implemented')
})

app.get('/table/:term/:dept/:course/:section', async (req, res) => {
    // SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? AND CLASS_SECTION=? ORDER BY TERM_CODE ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course, request.params.section]))
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    
    return res.json('Not yet implemented')
})

app.get('/table/:term/:dept/:course', async (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    try {
        if(req.params.term.toLowerCase() === "all") {
            // SELECT * FROM records WHERE DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC', [request.params.dept, request.params.course]))
            let query = db.collection('records')
            .where('DEPT', '==', req.params.dept.toUpperCase())
            .where('CATALOG_NBR', '==', req.params.course.toUpperCase())
            .orderBy('TERM_CODE', 'asc')
            .orderBy('CLASS_SECTION', 'asc')
    
            let snapshot = await query.get();
            //console.log(snapshot)
            //console.log(snapshot.empty, snapshot.docs)
            let docs = snapshot.empty ? [] : snapshot.docs.map(e => e.data())
            return res.json(docs);
        }
        else {
            // SELECT * FROM records WHERE TERM_CODE=? AND DEPT=? AND CATALOG_NBR=? ORDER BY TERM_CODE ASC, CLASS_SECTION ASC', [request.params.term, request.params.dept, request.params.course]))
            let query = db.collection('records')
            .where('TERM_CODE', '==', Number(req.params.term))
            .where('DEPT', '==', req.params.dept.toUpperCase())
            .where('CATALOG_NBR', '==', req.params.course.toUpperCase())
            .orderBy('CLASS_SECTION', 'asc')
    
            let snapshot = await query.get();
            let docs = snapshot.empty ? [] : snapshot.docs.map(e => e.data())
            return res.json(docs);
        }
    }
    catch(err) {
        console.log(err)
        res.status(500).json('Error')
    }
})

// Create "main" function to host all other top-level functions
const main = express();
main.use('/api', app);
exports.main = functions.https.onRequest(main);

