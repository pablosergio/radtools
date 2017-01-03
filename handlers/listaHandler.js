/**
 * Created by Sergio on 10/12/2016.
 */
var listaService = require('../services/listaService.js');
var tokenService       = require('../services/tokenService');
var jwt                = require('jsonwebtoken');
var cfg                = require('config');
var filterService      = require('../services/filterService');      
var _                  = require('lodash');

var listaHandler = function() {
    this.getListas = handleGetListasRequest;
    this.getListaByTipo = handleGetListaByTipoRequest;
    this.createLista = handleCreateListaRequest;
    this.updateLista = handleUpdateListaRequest;
    this.deleteLista = handleDeleteListaRequest;
}

function handleGetListasRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var lista = filterService.removeKeysNull(req.query);
    var paging = {
       limit: req.query.limit || 1000,
       start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;
    var service = listaService({username: payload.username, password: payload.password});
    service.getAllListas(lista, paging, order).then(function(result){
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

function handleGetListaByTipoRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var paging = {
        limit: req.query.limit || 1000,
        start: req.query.start || 0
    };

    var order = '"' + req.query.sort + '"' + ' ' +  req.query.dir;

    var service = listaService({username: payload.username, password: payload.password});
    service.getListaByTipo(req.query, paging, order).then(function(result){
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

function handleCreateListaRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = listaService({username: payload.username, password: payload.password});
    service.createLista(req.body).then(function(result){
        res.status(201).send({
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

function handleUpdateListaRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = listaService({username: payload.username, password: payload.password});
    service.updateLista(req.body).then(function(result){
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

function handleDeleteListaRequest(req, res, next) {
    var token = tokenService.getToken(req);
    var payload = jwt.decode(token, {complete: true}).payload;
    var service = listaService({username: payload.username, password: payload.password});
    service.deleteLista(req.body).then(function(result){
        res.status(200).send({
            success: true,
            data:result,
            msg:  cfg.get("COMMON.success")
        })
    }, function(err){
        res.status(500);
        res.send("ha ocurrido un error grave");
        return next(new Error(err));
    })
}

module.exports = listaHandler;