/**
 * Created by Sergio on 10/12/2016.
 */
var q = require('q');

module.exports = function(connection){
    var db = require('../model');
    db.setup(process.env.DATA_BASE, connection.username, connection.password,{
        host: process.env.DB_SERVER,
        logging: false,
        native: false
    });

    var application      = db.model('public.application');
    //     modeloDepartamento = db.model('public.modeloDepartamento'),
    //     propietario        = db.model('public.propietarios');

    var getApplications = function(filter, paging, order){
        return application.findAndCountAll({
            where: filter,
            limit: paging.limit,
            offset: paging.start,
            order: order,
            include: [
                //{ model: propietario, as: 'propietario' },
                //{ model: modeloDepartamento, as: 'modeloDepartamento' }
            ]
        })
    };

    var findById = function(id){
        return application.findById(id);
    };

    var createApplication = function(_application){
          return application
            .create({
                name_application: _application.name_application, 
                path_application: _application.path_application, 
                token_secret: _application.token_secret, 
                host: _application.host,
                port: _application.port,
                schema: _application.schema,
                database: _application.database
            });

    };

    var updateApplication = function(_application){
          return application.update(_application, { where: { application_id: _application.application_id }});
          
    };

    var deleteApplication = function(application){
          return application.destroy({ where: { applicationId: application.applicationId }});
          
    };


    return {
        getApplications: getApplications,
        findById: findById,
        createApplication: createApplication,
        updateApplication: updateApplication,
        deleteApplication: deleteApplication
    }
};