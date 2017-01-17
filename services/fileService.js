/**
 * Created by Vanessa on 1/1/2017.
 */
var _     = require('lodash'),
    fs    = require('fs'),
     q    = require('q'),
utils = require('./utilsService.js'),
multiline = require('multiline'),
beautify  = require('js-beautify').js_beautify;


exports.createModel = function(object){
    var deferred = q.defer();
    var path = 'D:/tempo/';
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    var filename = path.concat(object.table.replace(/\b\w/g, function(l){ return l.toUpperCase() }), '.js'); /* Nombre de Archivo formato Capitalize */
    var namespace = 'sglm.model.deuda.Deuda';
    /*var listOfFiles = [filename];
    listOfFiles.forEach(function(filename) {
        fs.unlink(filename);
    });*/
    fs.truncate(filename, 0, function(){
       var _file = fs.createWriteStream(filename, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })
        var model = "Ext.define('";
        _file.write(model.concat(namespace,"', {"))
        _file.write("extend: 'sacec.model.abstract.Abstract',")
        _file.write("fields: [")
        object.columns.forEach(function(column){
            var field = "{name: '";
            _file.write(field.concat(column.name, "' type: '", utils.getType(column.type).type, "'},")) // again
        })
        _file.write("]")

        /* belongsTo: {
         model: 'sacec.model.modeloDepartamento.ModeloDepartamento',
         foreignKey: 'modeloDepartamentoId',
         name: 'modeloDepartamento'
         },*/
        _file.write("")
        _file.write("});")

        /* for (var propName in object) {
            if (object[propName] == null || object[propName] == undefined || object[propName] == '') {
                delete object[propName];
            }
        }*/
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;
}