/*jslint node: true */
"use strict";
/*------------------------------------------------------------------------------------

DO NOT EDIT THIS FILE !!! It is generated automatically and will be overwritten.

To modify this model:
1. Create 'application.js' file in 'definition-files-custom' directory located in this file's parent directory.
2. Copy the code below and paste it into 'application.js'.
3. Use utility methods to easily access orm properties.

"use strict";
var orm     = require('model\index.js'),
    model   = require('./application.js'),
    util    = require('../utils.js')(model),
    Seq     = orm.Sequelize();

module.exports = model;

// Some utility methods:

util.getAttribute("application_id").comment = 'This is the comment'; 

------------------------------------------------------------------------------------*/
var orm = require('../index.js'),
    Seq = orm.Sequelize();
module.exports = {
    modelName: "public.application",
    options: {
        tableName: "application",
        schema: "public",
        timestamps: false
    },
    attributes: {
        "application_id": {
            type: Seq.INTEGER,
            field: "application_id",
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
            unique: "application_id_pkey"
        },
        "name_application": {
            type: Seq.TEXT,
            field: "name_application",
            allowNull: false
        },
        "path_application": {
            type: Seq.TEXT,
            field: "path_application",
            allowNull: false
        },
        "token_secret": {
            type: Seq.TEXT,
            field: "token_secret",
            allowNull: false
        },
        "host": {
            type: Seq.TEXT,
            field: "host",
            allowNull: false
        },
        "port": {
            type: Seq.INTEGER,
            field: "port",
            allowNull: false
        },
        "schema": {
            type: Seq.TEXT,
            field: "schema",
            allowNull: false
        },
        "database": {
            type: Seq.TEXT,
            field: "database",
            allowNull: false
        },
        "creation_date": {
            type: Seq.DATE,
            field: "creation_date"
        }
    },
    relations: []
};