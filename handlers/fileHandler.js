/**
 * Created by Vanessa on 1/1/2017.
 */
/**
 * Created by Vanessa on 31/12/2016.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var fileService = require('../services/fileService.js');
var tokenService       = require('../services/tokenService');
var jwt                = require('jsonwebtoken');
var cfg                = require('config');
var filterService      = require('../services/filterService');
var _                  = require('lodash');

var fileHandler = function() {
    this.createBaseApplication = handleCreateBaseApplicationRequest;
    this.createModel = handleCreateModelRequest;
    this.createStore = handleCreateStoreRequest;
    this.createService = handleCreateServiceRequest;
    this.createContext = handleCreateContextRequest;
    this.createMainPanel = handleCreateMainPanelRequest;
    this.createGrid = handleCreateGridRequest;
    this.createForm = handleCreateFormRequest;
    this.createFilterForm = handleCreateFilterFormRequest;
    this.createMainPanelController = handleCreateMainPanelControllerRequest;
    this.createGridController = handleCreateGridControllerRequest;
    this.createFormController = handleCreateFormControllerRequest;
    this.createHandler = handleCreateHandlerRequest;
    this.createBackendService = handleCreateBackendServiceRequest;
}

function handleCreateBaseApplicationRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createBaseApplication(params).then(function(result){
        res.status(200).send({
            success: true,
            //rows: result.rows,
            //total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateModelRequest(req, res, next) {
    //var token = tokenService.getToken(req);
    //var payload = jwt.decode(token, {complete: true}).payload;
    var params = req.body
    var _file = fileService.createModel(params).then(function(result){
        res.status(200).send({
            success: true,
            //rows: result.rows,
            //total: result.count
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateStoreRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createStore(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateServiceRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createService(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateContextRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createContext(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateMainPanelRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createMainPanel(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateGridRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createGrid(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateFormRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createForm(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateFilterFormRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createFilterForm(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateMainPanelControllerRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createMainPanelController(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateGridControllerRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createGridController(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateFormControllerRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createFormController(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateHandlerRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createHandler(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

function handleCreateBackendServiceRequest(req, res, next) {
    var params = req.body
    var _file = fileService.createBackendService(params).then(function(result){
        res.status(200).send({
            success: true,
        })
    }, function(err){
        res.status(500);
        res.send(err);
        return next(new Error(err));
    })
}

module.exports = fileHandler;