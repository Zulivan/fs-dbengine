const fs = require('fs-extra');
const path = require('path');
const debug = true;

let Private = {
    formatName: function (input, extension = false) {
        if (extension) {
            return input + '.json';
        };
        return input.split('.')[0];
    },
};

const Public = class FSDB {
    /**
     * Initialize fs-dbengine.
     * @param {string} database_name Name of the database.
     * @param {string} [options.cache] Name of the cache files folder of the database.
     * @param {string} [options.delay] At what interval should the DB be saved as backup (in seconds).
     * @param {string} [options.amount] How many backups should be stored in the backup folder.
     * @param {string} [options.root] Name of the root folder containing all databases and cache files.
     */

    constructor(database_name, options = {}) {
        if (!database_name) return 'Set database name';
        const self = this;

        Private.Root = options.root || 'fsdb';
        Private.Cache = options.cache || 'cache';
        Private.Delay = options.delay * 1000 || 30000;
        Private.Amount = options.amount || 2;
        Private.Folder = database_name;

        Private.DataValues = {};

        Private.Saves = {
            lastbackup: [],
            filesrestored: {}
        };

        self.validateDatase();

        if (Private.Delay > 0) {

            setInterval(function () {
                self.makeBackup();
            }, Private.Delay);

        };
    };

    debug(text) {
        if (debug) console.log(text);
    }

    makeBackup() {
        const self = this;
        return new Promise((success, error) => {
            self.debug('Making backup');

            const date = Date.now().toString();

            const db_folder = path.join(__dirname, Private.Root, Private.Folder);
            const saves_file = path.join(__dirname, Private.Root, Private.Cache, 'saves.json');
            const backup_folder = path.join(__dirname, Private.Root, Private.Cache, 'backup', date);

            fs.copySync(db_folder, backup_folder);

            Private.Saves.lastbackup.sort((a, b) => b - a);

            if (Private.Saves.lastbackup.length >= Private.Amount) {
                self.debug(Private.Saves.lastbackup);
                self.debug('Too many saves! Found ' + Private.Saves.lastbackup.length + '/' + Private.Amount);
                for (let i = 0; i < Private.Saves.lastbackup.length; i++) {
                    if (i >= Private.Amount - 2) {
                        self.debug('Oldest backup folder found "' + Private.Saves.lastbackup[i] + '" at index: ' + i);
                        fs.emptyDirSync(path.join(__dirname, Private.Root, Private.Cache, 'backup', Private.Saves.lastbackup[i]));
                        fs.rmdirSync(path.join(__dirname, Private.Root, Private.Cache, 'backup', Private.Saves.lastbackup[i]));
                        Private.Saves.lastbackup.splice(i, 1);
                    }
                }
            }

            Private.Saves.lastbackup.push(date);

            fs.writeFileSync(saves_file, JSON.stringify(Private.Saves));

            success(true);
        });
    }

    validateDatase() {
        if (!fs.existsSync(path.join(__dirname, Private.Root))) {
            fs.mkdirSync(path.join(__dirname, Private.Root));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Root, Private.Folder))) {
            fs.mkdirSync(path.join(__dirname, Private.Root, Private.Folder));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Root, Private.Cache))) {
            fs.mkdirSync(path.join(__dirname, Private.Root, Private.Cache));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Root, Private.Cache, 'backup'))) {
            fs.mkdirSync(path.join(__dirname, Private.Root, Private.Cache, 'backup'));
        };
        if (!fs.existsSync(path.join(__dirname, Private.Root, Private.Cache, 'saves.json'))) {
            fs.writeFileSync(path.join(__dirname, Private.Root, Private.Cache, 'saves.json'), 'Regeneration needed');
        }

        try {
            Private.Saves = JSON.parse(fs.readFileSync(path.join(__dirname, Private.Root, Private.Cache, 'saves.json')));
        } catch (wrong_json_file) {
            this.debug('Previous saves file is corrupted. Trying to regenerate it..');
            const backups = fs.readdirSync(path.join(__dirname, Private.Root, Private.Cache, 'backup'));
            const saves_file = path.join(__dirname, Private.Root, Private.Cache, 'saves.json');

            for (let i in backups) {
                Private.Saves.lastbackup.push(backups[i]);
            };

            Private.Saves.lastbackup.sort((a, b) => b - a);
            fs.writeFileSync(saves_file, JSON.stringify(Private.Saves));
            this.debug(Private.Saves.lastbackup)
            this.debug('Regeneration done, lost all file changes.')
        }
        return true;
    }

    saveTable(collection, table) {
        if (table) {
            fs.writeFileSync(path.join(__dirname, Private.Root, Private.Folder, collection, Private.formatName(table, true)), JSON.stringify(Private.DataValues[collection][table]));
        }
    }

    /**
     * Loads and gets a collection from database
     * @param {function} collection_name Name of the collection
     */

    getCollection(collection_name) {
        const self = this;
        return new Promise((success, error) => {

            const collection_path = path.join(__dirname, Private.Root, Private.Folder, collection_name);

            if (!fs.existsSync(collection_path)) {
                fs.mkdirSync(collection_path);
            };

            const collection_folder = fs.readdirSync(collection_path);
            Private.DataValues[collection_name] = {};

            for (let prop in collection_folder) {
                let values = '{}';
                try {
                    values = JSON.parse(fs.readFileSync(path.join(__dirname, Private.Root, Private.Folder, collection_name, collection_folder[prop])));
                } catch (wrong_json_file) {
                    this.debug('Collection: ' + collection_name + ', Corrupted table: ' + Private.formatName(collection_folder[prop]));
                    //Getting a valid version in the backups folder
                    const backups = fs.readdirSync(path.join(__dirname, Private.Root, Private.Cache, 'backup'));

                    for (let i in backups) {
                        try {
                            values = JSON.parse(fs.readFileSync(path.join(__dirname, Private.Root, Private.Cache, 'backup', backups[i], collection_name, collection_folder[prop])));
                            this.debug('Found a valid file for the table: ' + Private.formatName(collection_folder[prop]));
                            self.saveTable(collection_name, Private.formatName(collection_folder[prop]));
                            if (!Private.Saves.filesrestored[Private.Folder]) {
                                Private.Saves.filesrestored[Private.Folder] = {};
                            }
                            if (!Private.Saves.filesrestored[Private.Folder][collection_name]) {
                                Private.Saves.filesrestored[Private.Folder][collection_name] = [];
                            }
                            const save = {
                                backup: backups[i],
                                table: Private.formatName(collection_folder[prop]),
                                time: Date.now().toString()
                            }
                            Private.Saves.filesrestored[Private.Folder][collection_name].push(save);
                            break;
                        } catch (wrong_json_file2) {
                            this.debug('Backup #' + backups[i] + ' has a corrupted version of: ' + Private.formatName(collection_folder[prop]) + ', skipping...');
                        };
                    };
                };
                Private.DataValues[collection_name][Private.formatName(collection_folder[prop])] = values;
                self.saveTable(collection_name, Private.formatName(collection_folder[prop]));
            };

            const collection = {
                name: collection_name,
                scoped_table: null,
                scope(tbl) {
                    if (!tbl) return;
                    this.scoped_table = tbl;
                    return this;
                },
                get(tbl) {
                    this.scope(tbl);
                    const table = tbl || this.scoped_table;
                    if (!table) {
                        return self.debug('No table set.');
                    }
                    return Private.DataValues[this.name][table] || {};
                },
                set(value, index, tbl) {
                    this.scope(tbl);
                    const table = tbl || this.scoped_table;
                    if (!table) return self.debug('No table set.');

                    if (Array.isArray(index)) {
                        if (!Private.DataValues[this.name][table]) {
                            Private.DataValues[this.name][table] = {};
                        }

                        index.push('fix');
                        const indexes = index.length - 1;

                        // Looking for a better solution
                        if (indexes == 2) {
                            Private.DataValues[this.name][table][index[0]][index[1]] = value;
                        }
                        if (indexes == 3) {
                            Private.DataValues[this.name][table][index[0]][index[1]][index[2]] = value;
                        }
                        if (indexes == 4) {
                            Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]] = value;
                        }
                        if (indexes == 5) {
                            Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]][index[4]] = value;
                        }
                        if (indexes == 6) {
                            Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]][index[4]][index[5]] = value;
                        }

                    } else if (index) {
                        if (!Private.DataValues[this.name][table]) {
                            Private.DataValues[this.name][table] = {};
                        }
                        Private.DataValues[this.name][table][index] = value;
                    } else {
                        Private.DataValues[this.name][table] = value;
                    }
                    self.saveTable(this.name, table);
                    return this;
                },
                delete(index, tbl) {
                    this.scope(tbl);
                    const table = tbl || this.scoped_table;
                    if (!table) return self.debug('No table set.');

                    if (Array.isArray(index)) {
                        if (!Private.DataValues[this.name][table]) {
                            Private.DataValues[this.name][table] = {};
                        }

                        index.push('fix');
                        const indexes = index.length - 1;

                        // Looking for a better solution
                        if (indexes == 2) {
                            delete Private.DataValues[this.name][table][index[0]][index[1]];
                        }
                        if (indexes == 3) {
                            delete Private.DataValues[this.name][table][index[0]][index[1]][index[2]];
                        }
                        if (indexes == 4) {
                            delete Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]];
                        }
                        if (indexes == 5) {
                            delete Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]][index[4]];
                        }
                        if (indexes == 6) {
                            delete Private.DataValues[this.name][table][index[0]][index[1]][index[2]][index[3]][index[4]][index[5]];
                        }

                    } else if (index) {
                        delete Private.DataValues[this.name][table][index];
                    } else {
                        Private.DataValues[this.name][table] = {};
                    }
                    self.saveTable(this.name, table);
                    return this;
                }
            }

            success(collection);
        });
    };
};

module.exports = Public;