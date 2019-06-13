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
    // CollectionLoaded(collection);
});

function CollectionLoaded(collection) {

    const data = collection.get(tableName); // This value is fixed, it cannot change even if you modify collection's values

    console.log(data);

    const object = {
        first: 'item',
        number: 198632,
        bool: true,
        is_it_a_test: null
    };

    collection.scope(tableName).set(object); // Setting table data.

    console.log(collection.get()); // Getting new values

    const sub_object = {
        this: {
            is: {
                a: {
                    test: true
                }
            }
        }
    }

    //             Value , Index, Table
    collection.set(false, 'bool', tableName).set(1337, 'number');
    collection.set(sub_object, 'is_it_a_test')
    collection.set('probably', ['is_it_a_test', 'this', 'is', 'a', 'test']);

    console.log(collection.get().is_it_a_test.this.is.a);

    collection.delete('is_it_a_test');

    console.log(collection.get());

    // collection.delete();

    console.log(collection.get());
};
setInterval(function () {
    console.log('Prevent it from ending.');
}, 3600 * 1000)