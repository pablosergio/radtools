/**
 * Created by Vanessa on 1/1/2017.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var applicationService = require('../services/applicationService.js');
var tokenService       = require('../services/tokenService');
var jwt                = require('jsonwebtoken');
var cfg                = require('config');
var filterService      = require('../services/filterService');
var _                  = require('lodash');

var applicationHandler = function() {
    this.createApplication = handleCreateApplicationRequest;
    this.updateApplication = handleUpdateApplicationRequest;
    this.getApplications = handleGetApplicationsRequest;
    this.getApplication = handleGetApplicationRequest;
    this.findById = handleFindByIdRequest;
}

function handleCreateApplicationRequest2(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = applicationService({username: payload.username, password: payload.password});
    service.createApplication(req.body).then(function(result){
        req.application = result;
        next();
        /*res.status(200).send({
            success: true,
            data: result,
            msg: cfg.get("COMMON.success") 
        })*/
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    });
}
function handleCreateApplicationRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var service = applicationService({username: "postgres", password: "postgres"});
    service.createApplication(req.body).then(function(result){
        req.application = result;
        res.status(200).send({
            success: true,
            data: result,
            msg: cfg.get("COMMON.success") 
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    });
}

function handleUpdateApplicationRequest(req, res, next) {
    var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    //var service = applicationService({username: payload.username, password: payload.password});
    var service = applicationService({username: "postgres", password: "postgres"});
    service.updateApplication(req.body).then(function(result){
        res.status(200).send({
            success: true,
            data:result,
            msg: cfg.get("COMMON.success")
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleGetApplicationsRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var filter = filterService.removeKeysNull(req.query);
    var _start = 0,
        _limit = 1000,
        _sort = 'application_id',
        _dir = 'ASC';
    
    if(typeof req.query.start !== "undefined")
        _start = req.query.start;
    if(typeof req.query.limit !== "undefined")
        _limit = req.query.limit;
    if(typeof req.query.sort !== "undefined") 
        _sort = req.query.sort;  
    if(typeof req.query.dir !== "undefined") 
        _dir = req.query.dir;  
    
    var paging = {
        limit: _limit,
        start: _start
    };

    var order = '"' + _sort + '"' + ' ' +  _dir;

    var service = applicationService({username: 'postgres', password: 'postgres'});
    //var service = applicationService({username: payload.username, password: payload.password});
    service.getApplications(filter, paging, order).then(function(result){
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

function handleGetApplicationRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var filter = filterService.removeKeysNull(req.query);
     var application_id = parseInt(req.params.id);
    
    var service = applicationService({username: 'postgres', password: 'postgres'});
    //var service = applicationService({username: payload.username, password: payload.password});
    service.findById(application_id).then(function(result){
        res.status(200).send({
            success: true,
            data: result,
            msg: cfg.get("COMMON.success")
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleFindByIdRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = applicationService({username: payload.username, password: payload.password});
    service.findById(req.body.application_id).then(function(result){
        
        req.body.path_application = result.path_application;
        req.body.name_application = result.name_application;

        req.query.host = result.host;
        req.query.port = result.port;
        req.query.database = result.database;
        req.query.schema = result.schema;
        req.query.username = req.body.username;
        req.query.password = req.body.password;
        req.query.table = req.body.table;
        next();
        /*res.status(200).send({
            success: true,
            data: result,
            msg: cfg.get("COMMON.success") 
        })*/
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    });
}

function handleGetTablesRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = applicationService({username: payload.username, password: payload.password});
    service.findById(req.body.application_id).then(function(result){
        //req.application = result;
        //next();
        res.status(200).send({
            success: true,
            data: result,
            msg: cfg.get("COMMON.success") 
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    });
}

module.exports = applicationHandler;