/**
 * Created by Vanessa on 31/12/2016.
 */
var q  = require('q'),
   pg  = require('pg')
   multiline = require('multiline');

module.exports = function(connection){
    var config = {
        user: connection.username, //env var: PGUSER
        database: connection.database || 'postgres', //env var: PGDATABASE
        password: connection.password, //env var: PGPASSWORD
        host: connection.host, // Server hosting the postgres database
        port: connection.port, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };

    var getListDataBase = function(filter, paging, order){
        var deferred = q.defer();
        // to run a query we can acquire a client from the pool,
        // run a query on the client, and then return the client to the pool
        var pool = new pg.Pool(config);
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query('select * from pg_catalog.pg_database where datistemplate = false;', function(err, result) {
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    //return console.error('error running query', err);
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    var getListSchemas = function(filter, paging, order){
        var deferred = q.defer();
        var pool = new pg.Pool(config);
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query("select distinct table_schema from information_schema.tables", function(err, result) {
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    var getListTables = function(filter, paging, order){
        var deferred = q.defer();
        var pool = new pg.Pool(config);
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            client.query("select table_name from information_schema.tables where table_schema = $1;", [filter.schema], function(err, result) {
                //call `done()` to release the client back to the pool
                done();

                if(err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    var getListColumns = function(filter, paging, order){
        var deferred = q.defer();
        var pool = new pg.Pool(config);
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            var query = multiline.stripIndent(function () {/*
             SELECT
             f.attnum AS number,
             f.attname AS name,
             f.attnum,
             f.attnotnull AS notnull,
             pg_catalog.format_type(f.atttypid,f.atttypmod) AS type,
             CASE
             WHEN p.contype = 'p' THEN 't'
             ELSE 'f'
             END AS primarykey,
             CASE
             WHEN p.contype = 'u' THEN 't'
             ELSE 'f'
             END AS uniquekey,
             CASE
             WHEN p.contype = 'f' THEN g.relname
             END AS foreignkey,
             CASE
             WHEN p.contype = 'f' THEN p.confkey
             END AS foreignkey_fieldnum,
             CASE
             WHEN p.contype = 'f' THEN p.conkey
             END AS foreignkey_connnum,
             CASE
             WHEN f.atthasdef = 't' THEN d.adsrc
             END AS default
             FROM pg_attribute f
             JOIN pg_class c ON c.oid = f.attrelid
             JOIN pg_type t ON t.oid = f.atttypid
             LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = f.attnum
             LEFT JOIN pg_namespace n ON n.oid = c.relnamespace
             LEFT JOIN pg_constraint p ON p.conrelid = c.oid AND f.attnum = ANY (p.conkey)
             LEFT JOIN pg_class AS g ON p.confrelid = g.oid
             WHERE c.relkind = 'r'::char
             AND n.nspname = $1
             AND c.relname = $2
             AND f.attnum > 0 ORDER BY number;
             */});

            query = query.replace(/\n/g, '').replace(/\t/g, ' ');

            client.query(query, [filter.schema, filter.table], function(err, result) {
                done();

                if(err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    return {
        getListDataBase: getListDataBase,
        getListSchemas: getListSchemas,
        getListTables: getListTables,
        getListColumns: getListColumns
    }
};