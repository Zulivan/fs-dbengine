const fs = require('fs');
const path = require('path');
const debug = true;

let Private = {
    formatName: function (input, extension=false){
        if(extension){
            return input+'.json';
        };
        return input.split('.')[0];
    }
};

const Public = class FSDB {
    /**
     * Initialize
     * @param {string} folder Path to the databse.
     * @param {string} cache Name of the the cache files folder of the database.
     */

    constructor(folder, cache) {

        Private.Cache = cache || '__cache';
        Private.Folder = folder;
        Private.DataValues = {};

        Private.Saves = {
            lastsave: null
        };

        this.validateDatase();

    };

    debug(text) {
        if (debug) console.log(text);
    }

    validateDatase() {
        if (!fs.existsSync(path.join(__dirname, Private.Folder))) {
            fs.mkdirSync(path.join(__dirname, Private.Folder));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Folder, Private.Cache))) {
            fs.mkdirSync(path.join(__dirname, Private.Folder, Private.Cache));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Folder, Private.Cache, 'backup'))) {
            fs.mkdirSync(path.join(__dirname, Private.Folder, Private.Cache, 'backup'));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Folder, Private.Cache, 'saves.json'))) {
            fs.writeFileSync(path.join(__dirname, Private.Folder, Private.Cache, 'saves.json'), Private.Saves);
        } else {
            try {
                Private.Saves = JSON.parse(fs.readFileSync(path.join(__dirname, Private.Folder, Private.Cache, 'saves.json')));
            } catch (e) {
                this.debug('Previous saves file is corrupted.');
            }
        };
        return true;
    }

    /**
     * Set the API class of the addon
     * @param {function} collection to call
     */

    getCollection(collection_name) {
        return new Promise((success, error) => {

            const collection_path = path.join(__dirname, Private.Folder, collection_name);

            if (!fs.existsSync(collection_path)) {
                fs.mkdirSync(collection_path);
            };

            const collection_folder = fs.readdirSync(collection_path);
            Private.DataValues[collection_name] = {};

            for (let prop in collection_folder) {
                let values;
                try {
                    values = JSON.parse(fs.readFileSync(path.join(__dirname, Private.Folder, collection_name, collection_folder[prop])));
                } catch (e) {
                    this.debug('Collection: '+collection_name+', Corrupted table: '+Private.formatName(collection_folder[prop]));
                }
                Private.DataValues[collection_name][Private.formatName(collection_folder[prop])] = values;
            
            };

            success(Private.DataValues[collection_name]);
        });
    };
};

module.exports = Public;