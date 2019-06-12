const dbName = 'Test';
const collectionName = 'C0LLecTion';
const tableName = 'VaLuEs';

const Options = {
    cache: '__temp',
    delay: 3,
    amount: 5
};

const fsdb = require('./index.js');
const Database = new fsdb(dbName, Options);

Database.getCollection(collectionName).then((collection) => {

    const data = collection.get(tableName); // This value is fixed, it cannot change even if you modify collection's values

    console.log(data);

    const object = {
        first: 'item',
        number: 198632,
        bool: true,
        attached: {
            value: null
        }
    };
    collection.set(tableName, object);

    console.log(collection.get(tableName));

    const sub_object = {
        second: 'object',
        something: 'else',
        2: 'say'
    }
    //             Table    , Value , Index
    collection.set(tableName, false, 'bool').set(tableName, 1337, 'number');
    collection.set(tableName, sub_object, 'unattached_value').set(tableName, sub_object, 'attached', 'value');

    console.log(collection.get(tableName).unattached_value);

});

setInterval(function () {
    console.log('Prevent it from ending.');
}, 3600 * 1000)