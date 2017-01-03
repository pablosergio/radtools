/**
 * Created by Sergio on 11/12/2016.
 */
var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var menuRepository = function(connection){
    var db = pgp(connection);
    return {
        getUserMenu: function(params){
            return db.query('SELECT * FROM menu_opciones JOIN usuario_menu_opciones ON usuario_menu_opciones.menu_opcion_id = menu_opciones.menu_opcion_id WHERE usuario_menu_opciones.username =${username}', params);
        }
    }

}

module.exports = menuRepository;