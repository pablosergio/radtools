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
    this.findById = handleFindByIdRequest;
}

function handleCreateApplicationRequest(req, res, next) {
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

function handleFindByIdRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = applicationService({username: payload.username, password: payload.password});
    service.findById(req.body.application_id).then(function(result){
        
        req.body.pathApplication = result.path_application;
        req.body.nameApplication = result.name_application;

        req.query.host = result.host;
        req.query.port = result.port;
        req.query.database = result.data_base;
        req.query.schema = result.db_schema;
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