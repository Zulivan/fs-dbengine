const dbName = 'Test';
const collectionName = 'TestCollection';
const userCollectionName = 'Users';
const table1Name = 'TableWan';

const Options = {
    cache: '__temp',
    delay: 3,
    amount: 5,
    directory: __dirname
};

const fsdb = require('fs-dbengine');
const Database = new fsdb(dbName, Options);

Database.getCollection(collectionName).then((collection) => {
    console.log('--- Using collection "'+collectionName+'" ---');
    Manipulations(collection);
});

Database.getCollection(userCollectionName).then((collection) => {
    console.log('--- Using collection "'+userCollectionName+'" ---');
    Users(collection);
});

function Users(collection) {
    for (let id = 0; id <= 100; id++){
        let BanList = [];

        for (let id = 0; id <= Math.floor(Math.random() * Math.floor(6)); id++){
            BanList.push({
                ID: (id.toString().substring(id.toString().length-1, id.toString().length) + Math.random().toString(36).substring(2, 15)).toUpperCase(),
                Reason: Math.floor(Math.random() * Math.floor(6)) + 1
            })
        };

        collection.scope('User-'+id).set({
            BannedFrom: BanList,
            Age: Math.floor(Math.random() * Math.floor(27)) + 13,
            Gender: Math.floor(Math.random() * Math.floor(2)), // Consider only 2 genders
            UID: (id.toString().substring(id.toString().length-1, id.toString().length) + Math.random().toString(36).substring(2, 7)).toUpperCase(),
            ID : id
        });
    }

    console.log(collection.get().UID); // Gets the lastest scope (the latest user).

    setInterval(() => {
        let userId = Math.floor(Math.random() * Math.floor(101));
        let userData = collection.scope('User-'+userId).get();
        let UID = userData.UID;
        let Age = userData.Age;
        let majorOrMinor = (Age >= 18) ? 'major' : 'minor';
        let heOrShe = (userData.Gender == 0) ? 'he' : 'she';
        console.log('The UID of User #'+userId+' is '+UID+' and '+heOrShe+' is '+majorOrMinor+' given that '+heOrShe+' is '+Age+'.');
        for (let i = 0; i < userData.BannedFrom.length; i++){
            console.log('- '+heOrShe+' has been banned from community '+userData.BannedFrom[i].ID+' for Reason #'+userData.BannedFrom[i].Reason);
        }
        console.log('');
    }, 2500);
}

function Manipulations(collection) {
    const object = {
        first: 'item',
        int: 198632,
        bool: true,
        is_it_a_test: null
    };

    collection.scope(table1Name).set(object); // Setting table data.

    console.log('\n\r Set table " '+table1Name+' " content to:');
    console.log(collection.get()); // Getting new values without entering the table name.

    const sub_object = {
        this: {
            is: {
                a: {
                    test: true
                }
            }
        }
    }

    //             Value , Index, Table -- Changing two values in a row.
    collection.set(false, 'bool', table1Name).set(1337, 'int');
    collection.set(sub_object, 'is_it_a_test');

    console.log('\n\r Changed values of " '+table1Name+' " to:');
    console.log(collection.get());

    console.log('\n\r is_it_a_test data for " '+table1Name+' ":');
    console.log(collection.get().is_it_a_test.this);

    collection.set('probably', ['is_it_a_test', 'this', 'is', 'a', 'test']); // Changing the value of nested object value test.

    console.log('\n\r New is_it_a_test data for " '+table1Name+' ":');
    console.log(collection.get().is_it_a_test.this);

    console.log('\n\r is_it_a_test has been removed from " '+table1Name+' "');
    collection.delete('is_it_a_test');

};