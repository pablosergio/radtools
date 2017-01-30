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


module.exports = applicationHandler;