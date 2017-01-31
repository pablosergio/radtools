/**
 * Created by Sergio on 10/12/2016.
 */
var jwt = require('express-jwt');

function setup(router, handlers) {

    // ROUTES FOR Common API
    // =============================================================================
    /* @add routes */
    router.post('/login', handlers.login.authenticate);
    /* @end routes */
}

exports.setup = setup;