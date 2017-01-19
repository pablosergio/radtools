/**
 * Created by Vanessa on 1/1/2017.
 */
var _     = require('lodash'),
    fs    = require('fs'),
    shell = require('shelljs'),
     q    = require('q'),
    utils = require('./utilsService.js'),
multiline = require('multiline'),
      cfg = require("config"),
beautify  = require('js-beautify').js_beautify;


exports.createModel = function(object){
    var deferred = q.defer();
    var _namespace = 'sglm.model';
    var path = 'D:/tempo/model/'.concat(utils.toCamelCase(object.table), '/');
    shell.mkdir('-p', path);

    /*if (!fs.existsSync(path)){
        fs.mkdirSync(path);
    }*/
    
    var filename = path.concat(utils.toCamelCase(object.table, true), 'Model.js'); /* Nombre de Archivo formato camelCase Capitalize */
    var namespace = _namespace.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Model");
    
    fs.truncate(filename, 0, function(){
       var _file = fs.createWriteStream(filename, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })
        var listOfDependencies = [];
        var define  = "Ext.define('";
        var extend  = "\textend: '";
        _file.write(define.concat(namespace,"', {\n"))
        _file.write(extend.concat(cfg.CLASS_EXTJS.model,"',\n"))
        _file.write("\trequires: [\n")
        listOfDependencies.forEach(function(dependencia) {
            _file.write("\t\t'" + dependencia + "',\n")
        });
        _file.write("\t],\n")
        _file.write("\tidProperty: '".concat(utils.getIdProperty(object.columns), "',\n"))
        _file.write("\tfields: [\n")
        object.columns.forEach(function(column){
            var field = "\t\t{ name: '";
             _file.write(field.concat(column.name, "' type: '", utils.getType(column.type).type, "'"))
             if(column.primarykey == 't'){
                _file.write(", useNull: true")
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
                _file.write("\t\t{ name: '".concat(utils.toCamelCase(column.foreignkey), "' },\n"))
             }
        })
        _file.write("\t],\n")
        object.columns.forEach(function(column){
            if(column.foreignkey){
                _file.write("\thasOne: {\n")
                _file.write("\t\tmodel: '".concat(_namespace, ".", utils.toCamelCase(column.foreignkey), '.', utils.toCamelCase(column.foreignkey, true), "Model", "',\n"))
                _file.write("\t\tforeignKey: '".concat(column.name, "',\n"))
                _file.write("\t\tname: '".concat(utils.toCamelCase(column.foreignkey), "'\n"))
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
};

exports.createStore = function(object){
    var deferred = q.defer();
    var _namespace = 'sglm.store';

    var path = 'D:/tempo/store/'.concat(utils.toCamelCase(object.table), '/');
    shell.mkdir('-p', path);

    var filename = path.concat(utils.toCamelCase(object.table, true), 'Store.js'); /* Nombre de Archivo formato Capitalize */
    var namespace = _namespace.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Store")
    fs.truncate(filename, 0, function(){
       var _file = fs.createWriteStream(filename, {
            flags: 'a' 
        })
        var listOfDependencies = ['sglm.model.'.concat(utils.toCamelCase(object.table), '.', utils.toCamelCase(object.table, true), "Model")];
        var define  = "Ext.define('";
        var extend  = "\textend: '";
        _file.write(define.concat(namespace,"', {\n"))
        _file.write(extend.concat(cfg.CLASS_ABSTRACT.store,"',\n"))
        _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
        _file.write("\t],\n")
        _file.write("\tinject: ['appConfig', 'localStorageService'],\n")
        _file.write("\tconfig: {\n")
        _file.write("\t\tappConfig: null,\n")
        _file.write("\t\tlocalStorageService: null\n")
        _file.write("\t},\n")
        _file.write("\tmodel: 'sglm.model.".concat(utils.toCamelCase(object.table), '.', utils.toCamelCase(object.table, true), "Model","',\n"))
        _file.write("\tconstructor: function(cfg) {\n")
        _file.write("\t\tvar _this = this;\n")
        _file.write("\t\tif (cfg == null) {\n")
        _file.write("\t\t\tcfg = {};\n")
        _file.write("\t\t}\n")
        _file.write("\t\tthis.initConfig(cfg);\n")
        _file.write("\t\tExt.apply(this, {\n")
        _file.write("\t\t\tproxy: {\n")
        _file.write("\t\t\t\ttype: '".concat(cfg.PROXY_STORE.type, "',\n"))
        _file.write("\t\t\t\treader: {\n")
        _file.write("\t\t\t\t\ttype: '".concat(cfg.PROXY_STORE.reader.type, "',\n"))
        _file.write("\t\t\t\t\troot: '".concat(cfg.PROXY_STORE.reader.root, "',\n"))
        _file.write("\t\t\t\t\ttotalProperty: '".concat(cfg.PROXY_STORE.reader.totalProperty, "',\n"))
        _file.write("\t\t\t\t\tsuccessProperty: '".concat(cfg.PROXY_STORE.reader.successProperty, "',\n"))
        _file.write("\t\t\t\t\tmessageProperty: '".concat(cfg.PROXY_STORE.reader.messageProperty, "',\n"))
        _file.write("\t\t\t\t},\n")
        _file.write("\t\t\t\twriter: {\n")
        _file.write("\t\t\t\t\ttype: '".concat(cfg.PROXY_STORE.writer.type, "',\n"))
        _file.write("\t\t\t\t\twriteAllFields: ".concat(cfg.PROXY_STORE.writer.writeAllFields, ",\n"))
        _file.write("\t\t\t\t\tallowSingle: ".concat(cfg.PROXY_STORE.writer.allowSingle, ",\n"))
        _file.write("\t\t\t\t\troot: '".concat(cfg.PROXY_STORE.writer.root, "',\n"))
        _file.write("\t\t\t\t},\n")
        _file.write("\t\t\t\theaders: {\n")
        _file.write("\t\t\t\t\t'Authorization': \"Bearer \" + _this.getLocalStorageService().get('".concat(cfg.TOKEN.key,"')\n"))
        _file.write("\t\t\t\t},\n")
        _file.write("\t\t\t\tapi: {\n")
        _file.write("\t\t\t\t\tread: this.getAppConfig().getEndpoint('".concat(utils.toCamelCase(object.table), "').url,\n"))
        _file.write("\t\t\t\t\tcreate: this.getAppConfig().getEndpoint('".concat(utils.toCamelCase(object.table), "').url,\n"))
        _file.write("\t\t\t\t\tupdate: this.getAppConfig().getEndpoint('".concat(utils.toCamelCase(object.table), "').url,\n"))
        _file.write("\t\t\t\t},\n")
        _file.write("\t\t\t\tsimpleSortMode: true\n")
        _file.write("\t\t\t},\n")
        _file.write("\t\t\tsorters : [\n")
        _file.write("\t\t\t\t{\n")
        _file.write("\t\t\t\t\tproperty: '".concat(utils.getIdProperty(object.columns), "',\n"))
        _file.write("\t\t\t\t\tdirection: '".concat(cfg.PROXY_STORE.sorters.direction, "',\n"))
        _file.write("\t\t\t\t}\n")
        _file.write("\t\t\t]\n")    
        _file.write("\t\t});\n")
        _file.write("\t\treturn this.callParent(arguments);\n")
        _file.write("\t}\n")    
        _file.write("\n")
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;    
};

exports.createService = function(object){
    var deferred = q.defer();
    var _namespace = 'sglm.service';

    var path = 'D:/tempo/service/'.concat(utils.toCamelCase(object.table), '/');
    shell.mkdir('-p', path);

    var filename = path.concat(utils.toCamelCase(object.table, true), 'Service.js'); /* Nombre de Archivo formato Capitalize */
    var namespace = _namespace.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true))
    fs.truncate(filename, 0, function(){
       var _file = fs.createWriteStream(filename, {
            flags: 'a' // 'a' means appending (old data will be preserved)
        })
        var listOfDependencies = ['sglm.model.'.concat(utils.toCamelCase(object.table), '.', utils.toCamelCase(object.table, true))];
        
        _file.write("Ext.define('".concat(namespace,"', {\n"))
        _file.write("\tinject: [\n")
        _file.write("\t\t'appConfig',\n")
        _file.write("\t\t'localStorageService',\n")
        _file.write("\t\t'" + utils.toCamelCase(object.table) + "Store',\n")
        _file.write("\t],\n")
        _file.write("\tconfig: {\n")
        _file.write("\t\tappConfig: null,\n")
        _file.write("\t\tlocalStorageService: null,\n")
        _file.write("\t\t" + utils.toCamelCase(object.table) + "Store: null,\n")
        _file.write("\t},\n")
        _file.write("\tconstructor: function(cfg) {\n")
        _file.write("\t\tvar _this = this;\n")
        _file.write("\t\tif (cfg == null) {\n")
        _file.write("\t\t\tcfg = {};\n")
        _file.write("\t\t}\n")
        _file.write("\t\tthis.initConfig(config);\n")
        _file.write("\t\treturn this.callParent(arguments);\n")
        _file.write("\t},\n")
        
        _file.write("\n")
        
        _file.write("\t/* Description: Load ".concat(utils.toCamelCase(object.table, true), " */\n"))
        _file.write("\t/* Params: params = { param1: valor1, ....} or {} or  null */\n")
        _file.write("\t/* Return: records of ".concat(utils.toCamelCase(object.table, true), " */\n"))
        
        _file.write("\tload".concat(utils.toCamelCase(object.table, true), ": function(params) {\n"))
        _file.write("\t\tvar deferred;\n")
        _file.write("\t\tdeferred = Ext.create('Deft.promise.Deferred');\n")
        _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().proxy.extraParams = params;\n"))
        _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().load({\n"))
        _file.write("\t\t\tcallback: function(records, operation, success) {\n")
        _file.write("\t\t\t\tif (success) {\n")      
        _file.write("\t\t\t\t\treturn deferred.resolve(records);\n")
        _file.write("\t\t\t\t} else {\n")
        _file.write("\t\t\t\t\treturn deferred.reject('Codigo error: ' + operation.error.status + '. Error: ' + operation.error.statusText);\n")
        _file.write("\t\t\t\t}\n")
        _file.write("\t\t\t},\n")
        _file.write("\t\t\tscope: this\n")
        _file.write("\t\t});\n")
        _file.write("\t\treturn deferred.promise;\n")
        _file.write("\t},\n")

        _file.write("\t/* Description: Save ".concat(utils.toCamelCase(object.table, true), " */\n"))
        _file.write("\t/* Params: params = { param1: valor1, ....} or {} or  null */\n")
        _file.write("\t/* Return: records of ".concat(utils.toCamelCase(object.table, true), " */\n"))
        
        _file.write("\tsave".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table), ") {\n"))
        _file.write("\t\tif (this.isNewSolicitud(".concat(utils.toCamelCase(object.table),")) {\n"))
        _file.write("\t\t\tthis.get".contact(utils.toCamelCase(object.table, true), "().add(", utils.toCamelCase(object.table),");\n"))
        _file.write("\t},\n")

        /*_file.write("\t\tvar deferred;\n")
        _file.write("\t\tdeferred = Ext.create('Deft.promise.Deferred');\n")
        _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().proxy.extraParams = params;\n"))
        _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().load({\n"))
        _file.write("\t\t\tcallback: function(records, operation, success) {\n")
        _file.write("\t\t\t\tif (success) {\n")      
        _file.write("\t\t\t\t\treturn deferred.resolve(records);\n")
        _file.write("\t\t\t\t} else {\n")
        _file.write("\t\t\t\t\treturn deferred.reject('Codigo error: ' + operation.error.status + '. Error: ' + operation.error.statusText);\n")
        _file.write("\t\t\t\t}\n")
        _file.write("\t\t\t},\n")
        _file.write("\t\t\tscope: this\n")
        _file.write("\t\t});\n")
        _file.write("\t\treturn deferred.promise;\n")
        _file.write("\t},\n")

/*
           saveSolicitud: function(solicitud) {
    if (this.isNewSolicitud(solicitud)) {
      this.getSolicitudStore().add(solicitud);
    }
    solicitud.set("fecha_reg", new Date());
    return this.syncSolicitudStore();
  },   
*/
      
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;    
}

/*
Ext.define("sglm.service.SolicitudService", {
  inject: ["solicitudStore", "solicitudBusquedas", "localStorageService", "appConfig", "verificacionMedidorStore"],
  config: {
    solicitudStore: null,
    solicitudBusquedas: null,
    localStorageService: null,
    verificacionMedidorStore: null,
    appConfig: null
  },
  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    this.initConfig(config);
    return this.callParent(arguments);
  },

  loadInitialData: function() {
    //return Deft.Chain.parallel([this.loadProbabilities, this.loadRevenueImpacts, this.loadAffectedItems], this);
  },
  loadSolicitud: function(params) {
    var deferred;
    deferred = Ext.create("Deft.promise.Deferred");
    this.getSolicitudStore().load({
      params: params,
      callback: function(records, operation, success) {
        if (success) {
          return deferred.resolve(records);
        } else {
          return deferred.reject("Codigo error: " + operation.error.status + ". Error: " + operation.error.statusText);
        }
      },
      scope: this
    });
    return deferred.promise;
  },

  buscarSolicitud: function(params){
    var deferred;
    deferred = Ext.create("Deft.promise.Deferred");
    this.getSolicitudBusquedas().load({
      params: params,
      callback: function(records, operation, success) {
        if (success) {
          if(records.length > 0)
            return deferred.resolve(records);
          else {
            return deferred.reject("No se econtraron coincidencias");
          }
        } else {
          return deferred.reject("Codigo error: " + operation.error.status + ". Error: " + operation.error.statusText);
        }
      },
      scope: this
    });
    return deferred.promise;
  },

  saveSolicitud: function(solicitud) {
    if (this.isNewSolicitud(solicitud)) {
      this.getSolicitudStore().add(solicitud);
    }
    solicitud.set("fecha_reg", new Date());
    return this.syncSolicitudStore();
  },

  deleteSolicitud: function(solicitud) {
    this.getSolicitudStore().remove(solicitud);
    return this.syncSolicitudStore();
  },

  syncSolicitudStore: function() {
    var deferred;
    deferred = Ext.create("Deft.promise.Deferred");
    this.getSolicitudStore().sync({
      success: function(batch, options) {
        var res = Ext.JSON.decode( batch.operations[0].response.responseText);
        if(res.success){
          return deferred.resolve(res);
        } else{
          return deferred.reject(res.msg);
        }
        
      },
      failure: function(batch, options) {
        this.getSolicitudStore().rejectChanges();
        return deferred.reject(batch.exceptions[0].error);
      },
      scope: this
    });
    return deferred.promise;
  },

  isNewSolicitud: function(solicitud) {
    var esNuevo = solicitud.get('id_sol') ? false : true;
    return esNuevo;
  },

*/

