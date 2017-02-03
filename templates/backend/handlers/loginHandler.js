/**
 * Created by Sergio on 10/12/2016.
 */
var loginService = require('../services/loginService.js');

var loginHandler = function() {
    this.authenticate = handleAuthenticationRequest;
};

function handleAuthenticationRequest(req, res, next) {
    var service = loginService();
    service.authenticate({username: req.body.username, password: req.body.password}).then(function(token){
        res.status(201).send({
            success: true,
            token:token
        })
    }, function (err) {
        res.status(500);
        res.send(err.message);
        return next(new Error(err));
    });
}

module.exports = loginHandler;