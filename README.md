# FS-DBENGINE
Because __fsdb__ was already used...

This module allows you to save data without having a real database server running outside your code __quite__ easily.

This solution is an experiment despite the fact that it is ~~theoretically stable~~ in beta.

#### I don't know what to think about it... Even the idea of someone who will ever try it and give their feedback happens to be miraculous.

## Tree:

```
fsdb (Customizable name) 
│
└─── __cache (Customizable name)
│   │   saves.json (Manages backup system)
│   │
│   └─── backup
│       │   1560377410 
│       │   1560377440
│       │   ...
│       (A folder that contains all backups called by the time they were created)
│   
└─── database (Customizable name)
    └─── Collection (Customizable name)
        │   table1.json (Customizable name)
        │   table2.json (Customizable name)
        │   ...
        (Each JSON file contains stringified values)
```

## Functionalities:
- [x] Save a defined amount of backups or none.

- [x] Create/Access collections. (folder)

- [x] Create/Set tables (json files)

- [ ] Apply backups when a file is corrupted.

- [ ] Get a better way to access objects values when more than 2 keys are required (current method is bad)

- [ ] Delete keys if these