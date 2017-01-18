/**
 * Created by Vanessa on 1/1/2017.
 */
var _     = require('lodash'),
    fs    = require('fs'),
     q    = require('q'),
    utils = require('./utilsService.js'),
multiline = require('multiline'),
      cfg = require("config"),
beautify  = require('js-beautify').js_beautify;


exports.createModel = function(object){
    var deferred = q.defer();
    var _namespace = 'sglm.model';
    var path = 'D:/tempo/';
    if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }
    var filename = path.concat(object.table.replace(/\b\w/g, function(l){ return l.toUpperCase() }), '.js'); /* Nombre de Archivo formato Capitalize */
    var namespace = _namespace.concat(".",object.table, ".", object.table.replace(/\b\w/g, function(l){ return l.toUpperCase() }))
    /*var listOfFiles = [filename];
    listOfFiles.forEach(function(filename) {
        fs.unlink(filename);
    });*/
    fs.truncate(filename, 0, function(){
       var _file = fs.createWriteStream(filename, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })
        var listOfDependencies = ['app.model.model'];
        var define  = "Ext.define('";
        var extend  = "\textend: '";
        _file.write(define.concat(namespace,"', {\n"))
        _file.write(extend.concat(cfg.CLASS_EXTJS.model,"',\n"))
        _file.write("\trequires: [\n")
        listOfDependencies.forEach(function(dependencia) {
            _file.write("\t\t'" + dependencia + "',\n")
        });
        _file.write("\t]\n")
        _file.write("\tidProperty: '".concat(utils.getIdProperty(object.columns), "'\n"))
        _file.write("\tfields: [\n")
        object.columns.forEach(function(column){
            var field = "\t\t{ name: '";
             _file.write(field.concat(column.name, "' type: '", utils.getType(column.type).type, "'"))
             if(column.primarykey == 't'){
                _file.write(", useNull: 'true'")
             }else if(column.default){
                switch(utils.getType(column.type).type){
                    case "date":
                        if(column.default == 'now()')
                            _file.write(", defaultValue: new Date()")
                        break;
                    default:
                            _file.write(", defaultValue: '" + column.default + "'")
                        break;    
                }       
             }
             _file.write(" },\n") // again
        })

        object.columns.forEach(function(column){
             if(column.foreignkey){
                _file.write("\t\t{ name: '".concat(column.foreignkey, "' },\n"))
             }
        })
        _file.write("\t]\n")
        object.columns.forEach(function(column){
            if(column.foreignkey){
                _file.write("\thasOne: {\n")
                _file.write("\t\tmodel: '".concat(_namespace, ".", column.foreignkey, '.', column.foreignkey.replace(/\b\w/g, function(l){ return l.toUpperCase() }), "',\n"))
                _file.write("\t\tforeignKey: '".concat(column.name, "',\n"))
                _file.write("\t\tname: '".concat(column.foreignkey, "'\n"))
                _file.write("\t},\n")
            }
        })
        /* belongsTo: {
         model: 'sacec.model.modeloDepartamento.ModeloDepartamento',
         foreignKey: 'modeloDepartamentoId',
         name: 'modeloDepartamento'
         },*/
        _file.write("\n")
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;
}