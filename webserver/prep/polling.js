#!/usr/bin/env node

(async function(){
    const {promisify} = require('util')
    // const http = require('http')
    // const get = promisify(http.get).bind(http)
    const fetch = require('node-fetch')
    const timeout = promisify(setTimeout)

    // poll for 60 seconds
    for(let i = 0; i < 12; i++) {
        console.log('[polling.js] ==> GET http://cougar-grades.importer:8000')
        try {
            let res = await fetch('http://cougar-grades.importer:8000')
            console.log(`[polling.js] <== HTTP/${res.status}`)
            // any response means we reached the server
            process.exit(0)
        }
        catch(err) {
            console.log(`[polling.js] <== ${err.code}`)
        }
        
        await timeout(5000)
    }

    // limit exceeded
    process.exit(9)
})()