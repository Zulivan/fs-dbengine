const fsdb = require('./index.js');
const Database = new fsdb('db');

Database.getCollection('some1').then((collection) => {
    console.log(collection)
});

setInterval(function () {
    console.log('Prevent it from ending.');
}, 3000)