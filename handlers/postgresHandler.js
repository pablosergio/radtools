/**
 * Created by Vanessa on 31/12/2016.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var postgresService = require('../services/postgresService.js');
var tokenService       = require('../services/tokenService');
var jwt                = require('jsonwebtoken');
var cfg                = require('config');
var filterService      = require('../services/filterService');
var _                  = require('lodash');

var postgresHandler = function() {
    this.createDataBase = handleCreateDataBaseRequest;
    this.createBaseTables = handleCreateBaseTablesRequest;
    this.getListDataBase = handleGetListDataBaseRequest;
    this.getListSchemas = handleGetListSchemasRequest;
    this.getListTables = handleGetListTablesRequest;
    this.getListColumns = handleGetListColumnsRequest;
}

function handleCreateDataBaseRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var params = req.body;
    var service = postgresService({username: payload.username, password: payload.password});
    //var service = postgresService(params);
    service.createDataBase(params).then(function(result){
        next();
        /*res.status(200).send({
            success: true,
            msg: result
        })*/
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateBaseTablesRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var params = req.body;
    var service = postgresService({username: payload.username, password: payload.password});
    //var service = postgresService(params);
    service.createBaseTables(params).then(function(result){
        res.status(200).send({
            success: true,
            msg: result
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleGetListDataBaseRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var params = filterService.removeKeysNull(req.query);
    var paging = {
        limit: req.query.limit || 1000,
        start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;
    //var service = postgresService({username: payload.username, password: payload.password});
    var service = postgresService(params);
    service.getListDataBase(params, paging, order).then(function(result){
        res.status(200).send({
            success: true,
            rows: result.rows,
            total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleGetListSchemasRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var params = filterService.removeKeysNull(req.query);
    var paging = {
        limit: req.query.limit || 1000,
        start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;
    //var service = postgresService({username: payload.username, password: payload.password});
    var service = postgresService(params);
    service.getListSchemas(params, paging, order).then(function(result){
        res.status(200).send({
            success: true,
            rows: result.rows,
            total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleGetListTablesRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var params = filterService.removeKeysNull(req.query);
    var paging = {
        limit: req.query.limit || 1000,
        start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;
    //var service = postgresService({username: payload.username, password: payload.password});
    var service = postgresService(params);
    service.getListTables(params, paging, order).then(function(result){
        res.status(200).send({
            success: true,
            rows: result.rows,
            total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleGetListColumnsRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var params = filterService.removeKeysNull(req.query);
    var paging = {
        limit: req.query.limit || 1000,
        start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;
    //var service = postgresService({username: payload.username, password: payload.password});
    var service = postgresService(params);
    service.getListColumns(params, paging, order).then(function(result){
        res.status(200).send({
            success: true,
            table: result.table,
            columns: result.columns,
            total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

module.exports = postgresHandler;