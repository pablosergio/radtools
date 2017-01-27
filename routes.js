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
    router.post('/store',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createStore);
    router.post('/service',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createService);
    router.post('/context',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createContext);
    router.post('/mainPanel',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createMainPanel);
    router.post('/mainPanelController',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createMainPanelController);
    router.post('/grid',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createGrid);
    router.post('/gridController',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createGridController);
    router.post('/form',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createForm);
    router.post('/filterForm',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createFilterForm);
    router.post('/formController',jwt({secret: process.env.TOKEN_SECRET}), handlers.files.createFormController);
}

exports.setup = setup;