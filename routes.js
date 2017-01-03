/**
 * Created by Sergio on 10/12/2016.
 */
var jwt = require('express-jwt');

function setup(router, handlers) {

    // ROUTES FOR Common API
    // =============================================================================
    router.post('/login', handlers.login.authenticate);
    /* Routes for Listas */
    router.get('/listas', jwt({secret: process.env.TOKEN_SECRET}), handlers.lista.getListas);
    router.post('/listas', jwt({secret: process.env.TOKEN_SECRET}), handlers.lista.createLista);
    router.put('/listas', jwt({secret: process.env.TOKEN_SECRET}), handlers.lista.updateLista);
    router.delete('/listas', jwt({secret: process.env.TOKEN_SECRET}), handlers.lista.deleteLista);
    router.get('/listabytipo', jwt({secret: process.env.TOKEN_SECRET}), handlers.lista.getListaByTipo);

    /* Routes for lista DataBases from server Postgres */
    router.get('/databases', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListDataBase);
    router.get('/schemas', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListSchemas);
    router.get('/tables', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListTables);
    router.get('/columns', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListColumns);

    /* Write Files */
    router.post('/model',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createModel);
}

exports.setup = setup;