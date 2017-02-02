/**
 * Created by Vanessa on 31/12/2016.
 */
var q  = require('q'),
   pg  = require('pg'),
   pgtools = require('pgtools'),
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

    var createDataBase = function(params){
        // This can also be a connection string
        // (in which case the database part is ignored and replaced with postgres)
        const CONFIG = {
          user: params.username,
          password: params.password,
          port: params.port,
          host: params.host
        }

        return pgtools.createdb(CONFIG, params.database);

    };

    var createBaseTables = function(params){
        var deferred = q.defer();

        var pool = new pg.Pool({
            user: params.username,
            database: params.database,
            password: params.password,
            host: params.host,
            port: params.port,
            max: 10,
            idleTimeoutMillis: 30000
        });
        
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            var query = multiline.stripIndent(function () {/*
                CREATE TABLE menu_opciones
                (
                  menu_opcion_id serial NOT NULL,
                  opcion character varying(50) NOT NULL,
                  href character varying(250),
                  alias character varying(250),
                  tooltip character varying(250),
                  icono character varying(250),
                  opcion_padre integer,
                  posicion integer,
                  estado character varying(50),
                  CONSTRAINT menu_opciones_pk PRIMARY KEY (menu_opcion_id),
                  CONSTRAINT menu_opciones_opcion_padre_fkey FOREIGN KEY (opcion_padre)
                      REFERENCES menu_opciones (menu_opcion_id) MATCH SIMPLE
                      ON UPDATE NO ACTION ON DELETE NO ACTION
                );

                CREATE TABLE usuarios
                (
                  username text NOT NULL,
                  password character varying(50) NOT NULL,
                  nombre character varying(50) NOT NULL,
                  apellido character varying(50) NOT NULL,
                  fecha_creacion timestamp without time zone DEFAULT now(),
                  CONSTRAINT usuarios_pkey PRIMARY KEY (username)
                );

                CREATE TABLE usuario_menu_opciones
                (
                  usuario_menu_opcion_id serial NOT NULL,
                  username text NOT NULL,
                  menu_opcion_id integer NOT NULL,
                  estado character varying(50),
                  fecha_registro timestamp without time zone DEFAULT now(),
                  CONSTRAINT usuario_menu_opciones_pk PRIMARY KEY (usuario_menu_opcion_id),
                  CONSTRAINT usuario_menu_opciones_menu_opcion_id_fkey FOREIGN KEY (menu_opcion_id)
                      REFERENCES menu_opciones (menu_opcion_id) MATCH SIMPLE
                      ON UPDATE NO ACTION ON DELETE NO ACTION,
                  CONSTRAINT usuario_menu_opciones_username_fkey FOREIGN KEY (username)
                      REFERENCES usuarios (username) MATCH SIMPLE
                      ON UPDATE NO ACTION ON DELETE NO ACTION
                );
                CREATE ROLE admin LOGIN
                  PASSWORD 'admin'
                  SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;

                INSERT INTO menu_opciones(opcion, href, alias, tooltip, icono, opcion_padre, posicion, estado)
                  VALUES('Administracion', null, null, 'Administracion', 'cog', null, 1, 'ACTIVO');
                
                INSERT INTO usuarios(username, password, nombre, apellido)
                  VALUES('admin', 'admin', 'Administrador', 'Sistema');
                
                INSERT INTO usuario_menu_opciones(username, menu_opcion_id, estado)
                  VALUES('admin', 1, 'ACTIVO');
            */});

            query = query.replace(/\n/g, '').replace(/\t/g, ' ');

            client.query(query, function(err, result) {
                done();

                if(err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });

        });

        return deferred.promise;
    };

    var insertDefaulValues = function(params){
        var deferred = q.defer();

        var pool = new pg.Pool({
            user: params.username,
            database: params.database,
            password: params.password,
            host: params.host,
            port: params.port,
            max: 10,
            idleTimeoutMillis: 30000
        });
        
        pool.connect(function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }
            var query = multiline.stripIndent(function () {/*
                DROP ROLE admin;
                CREATE ROLE vclaros LOGIN
                  PASSWORD 'admin'
                  SUPERUSER INHERIT CREATEDB CREATEROLE NOREPLICATION;

                INSERT INTO menu_opciones(opcion, href, alias, tooltip, icono, opcion_padre, posicion, estado)
                  VALUES('Administracion', null, null, 'Administracion', 'cog', null, 1, 'ACTIVO');
                
                INSERT INTO usuarios(username, password, nombre, apellido)
                  VALUES('admin', 'admin', 'Administrador', 'Sistema');
                
                INSERT INTO usuario_menu_opciones(username, menu_opcion_id, estado)
                  VALUES('admin', 1, 'ACTIVO');
            */});

            query = query.replace(/\n/g, '').replace(/\t/g, ' ');

            client.query(query, function(err, result) {
                done();

                if(err) {
                    deferred.reject(err);
                }
                deferred.resolve(result);
            });

        });

        return deferred.promise;
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
                deferred.resolve({
                    table: filter.table,
                    columns: result.rows,
                    total: result.count
                });
            });
        });

        return deferred.promise;
    };

    return {
        createDataBase: createDataBase,
        createBaseTables: createBaseTables,
        getListDataBase: getListDataBase,
        getListSchemas: getListSchemas,
        getListTables: getListTables,
        getListColumns: getListColumns
    }
};