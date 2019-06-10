const fs = require('fs');
const path = require('path');

let Private = {};

const Public = class FSDB {
    /**
     * Initialize
     * @param {string} Path of the databse
     */
    
    constructor(folder) {
        
        Private.Folder = folder;

    };

    /**
     * Set the API class of the addon
     * @param {function} collection to call
     */

    getCollection(collection){



        Private.Collection = collection;
        success(collection);
    };
};

module.exports = Public;