# FS-DBENGINE
Because __fsdb__ was already taken.
This module allows you to save data without having an actual database server.
This solution is an experiment despite the fact that it is ~~theoretically~~ stable in beta.

## Tree:

```
fsdb (Customizable name) 
│
└─── __cache (Customizable name)
│   │   saves.json (Manages the backup system)
│   │
│   └─── backup
│       │   1560377410 
│       │   1560377440
│       │   ...
│       (A folder that contains all backups called by the time they were created)
│   
└─── Database1 (Customizable name)
│    └─── Collection1 (Customizable name)
│    │      table1.json (Customizable name)
│    │      table2.json (Customizable name)
│    │      ...
│    │
│    └─── Collection2 (Customizable name)
│        │   table1.json (Customizable name)
│        │   table2.json (Customizable name)
│        │   ...
│        (Each JSON file has stringified json)
│   
└─── Database2 (Customizable name)
│   └─── Collection (Customizable name)
│   │   │   Table.json (Customizable name)
│   │   │   ...
│   │   ...
│   ...
...
```

## Features:
- [x] Fully customizable.

- [x] Save a defined amount of backups or none.

- [x] Create/Access collections.

- [x] Create/Set tables.

- [x] Access and set nested data structures (see test.js).

- [x] Delete keys from a table.

- [X] Use backups to fix a corrupted file.

<a href="https://nodei.co/npm/fs-dbengine/"><img src="https://nodei.co/npm/fs-dbengine.png"></a>

#### I don't know what to think about it... Even the idea of someone who will ever try it and give their feedback happens to be miraculous.
