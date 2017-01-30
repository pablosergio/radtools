/**
 * Created by Sergio on 11/12/2016.
 */
module.exports = function(credentials){
    var connection = {
        host: process.env.DB_SERVER,
        port: process.env.DB_PORT,
        database: process.env.DATA_BASE,
        user: credentials.username,
        password: credentials.password
    };

    var menuRepository = require('../repositories/menuRepository')(connection);

    return {
        menuRepository: menuRepository

    }
};