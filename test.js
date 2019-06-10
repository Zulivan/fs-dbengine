const fsdb = require('index.js');
const path = require('path');

const Database = new fsdb(path.join(__dirname, 'db'));

Database.getCollection('some1').then( (collection, err) => {
    
});