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
    router.get('/postgres/databases', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListDataBase);
    router.get('/postgres/schemas', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListSchemas);
    router.get('/postgres/tables', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListTables);
    router.get('/postgres/columns', jwt({secret: process.env.TOKEN_SECRET}), handlers.postgres.getListColumns);
    /* Create App Base */
    router.post('/application/create',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.createApplication, handlers.files.createBaseApplication);
    router.post('/application/tables',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.postgres.getListTables);
    router.post('/application/table/columns',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.postgres.getListColumns);
    /* Write Files */
    router.post('/file/frontend/model',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createModel);
    router.post('/file/frontend/store',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createStore);
    router.post('/file/frontend/service',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createService);
    router.post('/file/frontend/context',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createContext);
    router.post('/file/frontend/mainPanel',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createMainPanel);
    router.post('/file/frontend/mainPanelController',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createMainPanelController);
    router.post('/file/frontend/grid',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createGrid);
    router.post('/file/frontend/gridController',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createGridController);
    router.post('/file/frontend/form',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createForm);
    router.post('/file/frontend/filterForm',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createFilterForm);
    router.post('/file/frontend/formController',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createFormController);
    /* Files Backend */
    router.post('/file/backend/handler',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createHandler);
    router.post('/file/backend/service',jwt({secret: process.env.TOKEN_SECRET}), handlers.application.findById, handlers.files.createBackendService);
}   

exports.setup = setup;