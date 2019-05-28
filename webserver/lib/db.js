
// get the client
const mysql = require('mysql2');
// create the connection
const connection = mysql.createPool({
    host: '127.0.0.1',
    port: 3001,
    user: 'root',
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const {promisify} = require('util')
const redis = require('redis').createClient({
    host: '127.0.0.1',
    port: 3002
});

module.exports = {
    query: promisify(connection.query).bind(connection),
    execute: promisify(connection.execute).bind(connection),
    get: promisify(redis.get).bind(redis),
    set: promisify(redis.set).bind(redis)
};


// // query database
// const [rows, fields] = await connection.execute('SELECT * FROM records');

// // redis successful (expire in a day)
// await redis.set('message', 'hello world', 'EX', 60*60*24)
// console.log(await redis.get('message'))
// console.log(await redis.get('fake key'))