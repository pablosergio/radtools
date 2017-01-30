/**
 * Created by Sergio on 10/12/2016.
 */
var jwt = require('express-jwt');

function setup(router, handlers) {

    // ROUTES FOR Common API
    // =============================================================================
    /* @add route api */
    router.post('/login', handlers.login.authenticate);
}

exports.setup = setup;