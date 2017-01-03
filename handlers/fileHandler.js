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
    this.createModel = handleCreateModelRequest;
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

module.exports = fileHandler;