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
     path = require('path'),
  appRoot = require('app-root-path'),
beautify  = require('js-beautify').js_beautify;

exports.createBaseApplication = function(object){
    var deferred = q.defer();
    var cmd = require('node-cmd');
    try {
        var appDir = object.path_application.concat('/', object.name_application);
        shell.mkdir('-p', appDir);
        var folderBackend = appRoot.path + '\\' + cfg.get("COMMON.templates.templatesDirectory") + '\\' + "backend";
        var folderFrontend = appRoot.path + '\\' + cfg.get("COMMON.templates.templatesDirectory") + '\\' + "frontend";
        /* Copy base application for backend */
        //shell.cp('-r', folderBackend, appDir);
        /* Copy base application for frontend */
        //shell.cp('-r', folderFrontend, appDir);
        
        /* SET CONFIG TO CONNECT DATA BASE BACKEND */
        var filename = appDir.concat("/backend/config/env/.development");
        fs.truncate(filename, 0, function(){
            var _file = fs.createWriteStream(filename, {
                flags: 'a'
            })
            _file.write("TOKEN_SECRET=developmentSessionSecret\n")
            _file.write("DB_USER=".concat(object.dbusername, "\n"))
            _file.write("DB_PASS=".concat(object.dbpassword, "\n"))
            _file.write("DATA_BASE=".concat(object.data_base, "\n"))
            _file.write("DB_DIALECT=postgres\n")
            _file.write("DB_PORT=".concat(object.port, "\n"))
            _file.write("DB_SCHEMA=".concat(object.db_schema, "\n"))
            _file.write("DB_SERVER=".concat(object.host, "\n"))
            _file.end();
        })
        var dirModel = appDir.concat("/backend/model");
        var fileConfig = appRoot.path + "\\config\\spgen\\default.js";
        var command ="spgen -h ".concat(object.host, " ", object.port, " -s ", object.db_schema, " -d ", object.data_base,  " -u ", object.dbusername, " -p ", object.dbpassword, " -o ", dirModel, " -t sequelize4");  
        cmd.run(command)    
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;
    }
};

exports.createModel = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.model.concat('/', utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);
        var filename = path.concat(utils.toCamelCase(object.table, true), 'Model.js'); /* Nombre de Archivo formato camelCase Capitalize */
        var namespace = cfg.WORKSPACE.model.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Model");
    
        fs.truncate(filename, 0, function(){
            var _file = fs.createWriteStream(filename, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            var listOfDependencies = [];
        
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_EXTJS.model,"',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            //_file.write("\tidProperty: '".concat(utils.getIdProperty(object.columns), "',\n"))
            _file.write("\tfields: [\n")
            object.columns.forEach(function(column){
                var field = "\t\t{ name: '";
                _file.write(field.concat(column.name, "', type: '", utils.getType(column.type).type, "'"))
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
                    _file.write("\t\tmodel: '".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(column.foreignkey), '.', utils.toCamelCase(column.foreignkey, true), "Model", "',\n"))
                    _file.write("\t\tforeignKey: '".concat(column.name, "',\n"))
                    _file.write("\t\tname: '".concat(utils.toCamelCase(column.foreignkey), "'\n"))
                    _file.write("\t},\n")
                }
            })
            _file.write("\n")
            _file.write("});")
            _file.end();
        })

        deferred.resolve(true);
    }
    catch (error) {
        deferred.reject(false);
    }
    finally {
        return deferred.promise;
    }
};

exports.createStore = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.store.concat('/', utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'Store.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.store.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Store")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            listOfDependencies.push(cfg.WORKSPACE.model.concat('.', utils.toCamelCase(object.table), '.', utils.toCamelCase(object.table, true), "Model"));
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.store,"',\n"))
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
            _file.write("\tmodel: '".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), '.', utils.toCamelCase(object.table, true), "Model","',\n"))
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
            _file.write("\t\t\t\t\tdestroy: this.getAppConfig().getEndpoint('".concat(utils.toCamelCase(object.table), "').url,\n"))
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
        var package = "\t\t\t".concat(utils.toCamelCase(object.table), "Store: '", namespace, "',");
        var endpoint = "\t\t\t\t".concat(utils.toCamelCase(object.table), ": {\n\t\t\t\t\tproxyId: '/", utils.toCamelCase(object.table), "'\n\t\t\t\t},");
        
        if(!utils.findLine(cfg.FILE.application, cfg.ANNOTATION.application.startInject, cfg.ANNOTATION.application.endInject, namespace)){
            utils.injectPackage(cfg.FILE.application, cfg.ANNOTATION.application.startInject, package);
        }
        if(!utils.findLine(cfg.FILE.appConfig, cfg.ANNOTATION.appConfig.addEndpoint, cfg.ANNOTATION.appConfig.endEndpoint, utils.toCamelCase(object.table))){
            utils.injectPackage(cfg.FILE.appConfig, cfg.ANNOTATION.appConfig.addEndpoint, endpoint);
        }
        
        deferred.resolve(true);
    }
    catch (error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;    
    }
};

exports.createService = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.service.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'Service.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.service.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Service")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            var listOfDependencies = [];
            
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
            _file.write("\n")
            _file.write("\tconstructor: function(cfg) {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\tif (cfg == null) {\n")
            _file.write("\t\t\tcfg = {};\n")
            _file.write("\t\t}\n")
            _file.write("\t\tthis.initConfig(cfg);\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            _file.write("\n")
        
            /* Function Load */        
            _file.write("\t/* Description: Load ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\t/* Params: params = { param1: valor1, ....} or {} or  null */\n")
            _file.write("\t/* Return: promise records of ".concat(utils.toCamelCase(object.table, true), " */\n"))
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
            _file.write("\n")

            /* Function Find */        
            _file.write("\t/* Description: Find ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\t/* Params: params = { param1: valor1, ....} or {} or  null */\n")
            _file.write("\t/* Return: promise records of ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\tfind".concat(utils.toCamelCase(object.table, true), ": function(params) {\n"))
            _file.write("\t\tvar deferred;\n")
            _file.write("\t\tvar store = Ext.create('".concat(cfg.WORKSPACE.store, ".store.", utils.toCamelCase(object.table),".", utils.toCamelCase(object.table, true), "Store');\n"))
            _file.write("\t\tdeferred = Ext.create('Deft.promise.Deferred');\n")
            _file.write("\t\tstore.proxy.extraParams = params;\n")
            _file.write("\t\tstore.load({\n")
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
            _file.write("\n")

            /* Function Save */
            _file.write("\t/* Description: Save ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\t/* Params: params = Objet ".concat(utils.toCamelCase(object.table, true), " */\n")) 
            _file.write("\t/* Return: Run sync".concat(utils.toCamelCase(object.table, true), "Store() */\n"))
            _file.write("\tsave".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table), ") {\n"))
            _file.write("\t\tif(this.isNew".concat(utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table),")) {\n"))
            _file.write("\t\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().add(", utils.toCamelCase(object.table),");\n"))
            _file.write("\t\t}\n")
            _file.write("\t\treturn this.sync".concat(utils.toCamelCase(object.table, true), "Store();\n"))
            _file.write("\t},\n")
            _file.write("\n")

            /* Function Delete */
            _file.write("\t/* Description: Delete ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\t/* Params: params = Objet ".concat(utils.toCamelCase(object.table, true), " */\n")) 
            _file.write("\t/* Return: Run sync".concat(utils.toCamelCase(object.table, true), "Store() */\n"))
            _file.write("\tdelete".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table), ") {\n"))
            _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "().remove(", utils.toCamelCase(object.table),");\n"))
            _file.write("\t\treturn this.sync".concat(utils.toCamelCase(object.table, true), "Store();\n"))
            _file.write("\t},\n")
            _file.write("\n")

            /* Function Sync Store */
            _file.write("\t/* Description: Sync".concat(utils.toCamelCase(object.table, true), "Store */\n"))
            _file.write("\t/* Params:  */\n") 
            _file.write("\t/* Return: promise response res: { success: true/false, msg: '', id: id } */\n")
            _file.write("\tsync".concat(utils.toCamelCase(object.table, true), "Store: function(", utils.toCamelCase(object.table), "){\n"))
            _file.write("\t\tvar deferred;\n")
            _file.write("\t\tdeferred = Ext.create('Deft.promise.Deferred');\n")
            _file.write("\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().sync({\n"))
            _file.write("\t\t\tsuccess: function(batch, options) {\n")
            _file.write("\t\t\t\tvar res = Ext.JSON.decode( batch.operations[0].response.responseText);\n")
            _file.write("\t\t\t\tif(res.success){\n")
            _file.write("\t\t\t\t\treturn deferred.resolve(res);\n")
            _file.write("\t\t\t\t} else{\n")
            _file.write("\t\t\t\t\treturn deferred.reject(res.msg);\n")
            _file.write("\t\t\t\t}\n")
            _file.write("\t\t\t},\n")
            _file.write("\t\t\tfailure: function(batch, options) {\n")
            _file.write("\t\t\t\tthis.get".concat(utils.toCamelCase(object.table, true), "Store().rejectChanges();\n"))
            _file.write("\t\t\t\treturn deferred.reject(batch.exceptions[0].error);\n")
            _file.write("\t\t\t},\n")
            _file.write("\t\t\tscope: this\n")
            _file.write("\t\t});\n")
            _file.write("\t\treturn deferred.promise;\n")
            _file.write("\t},\n")
            _file.write("\n")

            /* Function IsNewModel */
            _file.write("\t/* Description: is new ".concat(utils.toCamelCase(object.table, true), " */\n"))
            _file.write("\t/* Params: ".concat(utils.toCamelCase(object.table), " */\n")) 
            _file.write("\t/* Return: true or false */\n")
            _file.write("\tisNew".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table), "){\n"))
            _file.write("\t\tvar esNuevo = ".concat(utils.toCamelCase(object.table), ".get('", utils.getIdProperty(object.columns),"') ? false : true;\n"))
            _file.write("\t\treturn esNuevo;\n")
            _file.write("\t},\n")
            _file.write("\n")

            _file.write("});")
            _file.end();
        })
        var package = "\t\t\t".concat(utils.toCamelCase(object.table), "Service: '", namespace, "',");
        if(!utils.findLine(cfg.FILE.application, cfg.ANNOTATION.application.startInject, cfg.ANNOTATION.application.endInject, namespace)){
            utils.injectPackage(cfg.FILE.application, cfg.ANNOTATION.application.startInject, package);
        }
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;
    }
};

exports.createContext = function(object){
    var deferred = q.defer();
    try{
        var path = cfg.PATH.context.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'Context.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.context.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Context")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            var listOfDependencies = [];
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.context, "',\n"))
            _file.write("\n")
            /* Constructor */
            _file.write("\t/**\n")
            _file.write("\t/* Constructor.\n")
            _file.write("\t*/\n")
            _file.write("\tconstructor: function(config) {\n")
            _file.write("\t\tif (config == null) {\n")
            _file.write("\t\t\tconfig = {};\n")
            _file.write("\t\t}\n")
            _file.write("\t\tthis.callParent(arguments);\n")
            _file.write("\t\treturn this.addEvents('initialDataLoaded', '".concat(utils.toCamelCase(object.table), "Opened', '", utils.toCamelCase(object.table), "Created', '", utils.toCamelCase(object.table), "Deleted', '", utils.toCamelCase(object.table), "Canceled');\n"))
            _file.write("\t},\n")
            _file.write("\n")  
            /* Event Context LoadInitialData */
            _file.write("\t/**\n")
            _file.write("\t* @event initialDataLoaded Initial data loaded..\n")
            _file.write("\t*/\n")
            _file.write("\t".concat(utils.toCamelCase(object.table), "Opened: function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\treturn this.fireEvent('initialDataLoaded');\n")
            _file.write("\t},\n")
            _file.write("\n")
            /* Event Context Opended */
            _file.write("\t/**\n")
            _file.write("\t* Notified interested objects that a option ".concat(utils.toCamelCase(object.table, true), " is being opened.\n"))
            _file.write("\t* @event ".concat(utils.toCamelCase(object.table), "Opened option ", utils.toCamelCase(object.table), " opened.\n"))
            _file.write("\t* @param {".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), "}.\n"))
            _file.write("\t*/\n")
            _file.write("\t".concat(utils.toCamelCase(object.table), "Opened: function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\treturn this.fireEvent('".concat(utils.toCamelCase(object.table), "Opened', ", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t},\n")
            _file.write("\n")
            /* Event Context Created */
            _file.write("\t/**\n")
            _file.write("\t* Notified interested objects that a  ".concat(utils.toCamelCase(object.table, true), " has been created.\n"))
            _file.write("\t* @event ".concat(utils.toCamelCase(object.table), "Created option ", utils.toCamelCase(object.table), " created.\n"))
            _file.write("\t* @param {".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), "}.\n"))
            _file.write("\t*/\n")
            _file.write("\t".concat(utils.toCamelCase(object.table), "Created: function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\treturn this.fireEvent('".concat(utils.toCamelCase(object.table), "Created', ", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t},\n")
            _file.write("\n")
            /* Event Context Canceled */
            _file.write("\t/**\n")
            _file.write("\t* Notified interested objects that a  ".concat(utils.toCamelCase(object.table, true), " has been canceled.\n"))
            _file.write("\t* @event ".concat(utils.toCamelCase(object.table), "Created option ", utils.toCamelCase(object.table), " canceled.\n"))
            _file.write("\t* @param {".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), "}.\n"))
            _file.write("\t*/\n")
            _file.write("\t".concat(utils.toCamelCase(object.table), "Canceled: function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\treturn this.fireEvent('".concat(utils.toCamelCase(object.table), "Canceled', ", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t},\n")
            _file.write("\n")
            /* Event Context Deleted */
            _file.write("\t/**\n")
            _file.write("\t* Notified interested objects that a  ".concat(utils.toCamelCase(object.table, true), " has been deleted.\n"))
            _file.write("\t* @event ".concat(utils.toCamelCase(object.table), "Created option ", utils.toCamelCase(object.table), " deleted.\n"))
            _file.write("\t* @param {".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), "}.\n"))
            _file.write("\t*/\n")
            _file.write("\t".concat(utils.toCamelCase(object.table), "Deleted: function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\treturn this.fireEvent('".concat(utils.toCamelCase(object.table), "Deleted', ", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t},\n")
            _file.write("\n")
            _file.write("});")
            _file.end();
        })
        var package = "\t\t\t".concat(utils.toCamelCase(object.table), "Context: '", namespace, "',");
        if(!utils.findLine(cfg.FILE.application, cfg.ANNOTATION.application.startInject, cfg.ANNOTATION.application.endInject, namespace)){
            utils.injectPackage(cfg.FILE.application, cfg.ANNOTATION.application.startInject, package);
        }
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;
    }
};

exports.createMainPanel = function(object){
    var deferred = q.defer();
    try{
        var path = cfg.PATH.view.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'MainPanel.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "MainPanel")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            var listOfDependencies = [];
            if(object.grid)
                listOfDependencies.push(cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Grid"))
            if(object.form)
                listOfDependencies.push(cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Form"))
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_EXTJS.panel, "',\n"))
            _file.write("\tcontroller: '".concat(cfg.WORKSPACE.controller, ".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "MainPanelController',\n"))
            _file.write("\talias: 'widget.".concat(utils.toCamelCase(object.table), "-main-panel',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\ttitle: '".concat(utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\tlayout: 'border',\n")
            _file.write("\titems: [\n")
            if(object.grid){
                var width = object.form ? cfg.WIDTH.panel.region.center : "100%";
                _file.write("\t\t{\n")
                _file.write("\t\t\txtype: '".concat(utils.toCamelCase(object.table), "-grid',\n"))
                _file.write("\t\t\tregion: 'center',\n")
                _file.write("\t\t\twidth: '".concat(width,"'\n"))
                _file.write("\t\t},\n")        
            }
            if(object.form){
                _file.write("\t\t{\n")
                _file.write("\t\t\txtype: '".concat(utils.toCamelCase(object.table), "-form',\n"))
                _file.write("\t\t\tregion: 'east',\n")
                _file.write("\t\t\twidth: '".concat(cfg.WIDTH.panel.region.east, "',\n"))
                _file.write("\t\t\tcollapsible: true,\n")
                _file.write("\t\t\titemId: 'panelCollapsible".concat(utils.toCamelCase(object.table, true), "'\n"))
                _file.write("\t\t},\n")        
            }    
            _file.write("\t]\n")
            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;
    }
};

exports.createGrid = function(object){
    var deferred = q.defer();
    try{
        var path = cfg.PATH.view.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'Grid.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Grid")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.grid, "',\n"))
            _file.write("\tcontroller: '".concat(cfg.WORKSPACE.controller, ".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "GridController',\n"))
            _file.write("\talias: 'widget.".concat(utils.toCamelCase(object.table), "-grid',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\tinject: ['".concat(utils.toCamelCase(object.table), "Store'],\n"))
            _file.write("\tconfig: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Store: null\n"))
            _file.write("\t},\n")
            _file.write("\tinitComponent: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\tExt.apply(this, {\n")
            _file.write("\t\t\ttitle: '".concat(utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\t\t\tstore: this.get".concat(utils.toCamelCase(object.table, true), "Store(),\n"))
            _file.write("\t\t\tcolumns: [\n")
            object.columns.forEach(function(column) {
                _file.write(utils.convertToColumn(column).concat("\n"))
            });
            _file.write("\t\t\t]\n")
            _file.write("\t\t});\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;  
    }
};

exports.createForm = function(object){
    var deferred = q.defer();
    try {
        var isFilterForm = false;
        var path = cfg.PATH.view.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'Form.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "Form")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.form, "',\n"))
            _file.write("\tcontroller: '".concat(cfg.WORKSPACE.controller, ".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FormController',\n"))
            _file.write("\talias: 'widget.".concat(utils.toCamelCase(object.table), "-form',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            //_file.write("\tinject: ['".concat(utils.toCamelCase(object.table), "Store'],\n"))
            //_file.write("\tconfig: {\n")
            //_file.write("\t\t".concat(utils.toCamelCase(object.table), "Store: null\n"))
            //_file.write("\t},\n")
            _file.write("\tinitComponent: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            object.columns.forEach(function(column) {
                if(column.foreignkey)
                    _file.write("\t\t_this.".concat(utils.toCamelCase(column.foreignkey), "Store = Ext.create('", cfg.WORKSPACE.store, ".", utils.toCamelCase(column.foreignkey), ".", utils.toCamelCase(column.foreignkey, true), ".Store');\n"));
            });
            
            if(object.fieldsets.length > 0){
                object.fieldsets.forEach(function(fieldset) {
                    _file.write("\t\t_this.".concat(utils.toCamelCase(fieldset.name), " = ", utils.convertToForm(fieldset.columns, fieldset.fields, null, null, 2, isFilterForm), "\n"));
                });    
            }
            /*object.fieldsets.forEach(function(fielset) {
                if(column.foreignkey)
                    _file.write("\t\t\t_this.".concat(utils.toCamelCase(column.foreignkey), "Store = Ext.create('", cfg.WORKSPACE.store, ".", utils.toCamelCase(column.foreignkey), ".", utils.toCamelCase(column.foreignkey, true), ".Store');\n"));
            });*/
            
            _file.write("\t\tExt.apply(this, {\n")
            _file.write("\t\t\ttitle: '".concat(utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\t\t\titems: [\n")
            if(object.fieldsets.length > 0){
                object.fieldsets.forEach(function(fieldset) {
                    _file.write(utils.convertToFieldSet(fieldset, 3));
                });    
            }
            _file.write("\t\t\t]\n")
            _file.write("\t\t});\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally{
        return deferred.promise;  
    }
};

exports.createFilterForm = function(object){
    var deferred = q.defer();
    try{
        var isFilterForm = true;
        var path = cfg.PATH.view.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);
        var filename = path.concat(utils.toCamelCase(object.table, true), 'FilterForm.js'); 
        var namespace = cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FilterForm")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_EXTJS.form, "',\n"))
            //_file.write("\tcontroller: '".concat(cfg.WORKSPACE.controller, ".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FormController',\n"))
            _file.write("\talias: 'widget.".concat(utils.toCamelCase(object.table), "-filter-form',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\tinitComponent: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            object.columns.forEach(function(column) {
                if(column.foreignkey)
                    _file.write("\t\t_this.".concat(utils.toCamelCase(column.foreignkey), "Store = Ext.create('", cfg.WORKSPACE.store, ".", utils.toCamelCase(column.foreignkey), ".", utils.toCamelCase(column.foreignkey, true), ".Store');\n"));
            });
            
            if(object.fieldsets.length > 0){
                object.fieldsets.forEach(function(fieldset) {
                    _file.write("\t\t_this.".concat(utils.toCamelCase(fieldset.name), " = ", utils.convertToForm(fieldset.columns, fieldset.fields, null, null, 2, isFilterForm), "\n"));
                });    
            }
            
            _file.write("\t\tExt.apply(this, {\n")
            _file.write("\t\t\ttitle: '".concat(utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\t\t\titems: [\n")
            if(object.fieldsets.length > 0){
                object.fieldsets.forEach(function(fieldset) {
                    _file.write(utils.convertToFieldSet(fieldset, 3));
                });    
            }
            _file.write("\t\t\t]\n")
            _file.write("\t\t});\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            _file.write("});")
            _file.end();
        })

        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;
    }    
};

exports.createMainPanelController = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.controller.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);
        var filename = path.concat(utils.toCamelCase(object.table, true), 'MainPanelController.js'); /* Nombre de Archivo formato Capitalize */
        var namespace = cfg.WORKSPACE.controller.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "MainPanelController")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_EXTJS.controller, "',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\tinject: [\n")
            _file.write("\t\t'".concat(utils.toCamelCase(object.table), "Context'\n"))
            _file.write("\t],\n")
            _file.write("\tconfig: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: null\n"))
            _file.write("\t},\n")
            _file.write("\tobserve: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: {\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Created: 'onCollapsePanel',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Opened: 'onExpandPanel',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Canceled: 'onCollapsePanel',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Deleted: 'onCollapsePanel'\n"))
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tcontrol: {\n")
            _file.write("\t\tview: {\n")
            _file.write("\t\t\tboxready: 'loadInitialData',\n")
            _file.write("\t\t},\n")
            _file.write("\t\tpanelCollapsible".concat(utils.toCamelCase(object.table, true), ": {\n"))
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tinit: function() {\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            _file.write("\tloadInitialData: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getPanelCollapsible".concat(utils.toCamelCase(object.table, true), "().collapse();\n"))
            _file.write("\t},\n")
            _file.write("\tonCollapsePanel: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getPanelCollapsible".concat(utils.toCamelCase(object.table, true), "().collapse();\n"))
            _file.write("\t},\n")
            _file.write("\tonExpandPanel: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getPanelCollapsible".concat(utils.toCamelCase(object.table, true), "().expand();\n"))
            _file.write("\t}\n")
            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;  
    }
};

exports.createGridController = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.controller.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'GridController.js'); 
        var namespace = cfg.WORKSPACE.controller.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "GridController")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            listOfDependencies.push(cfg.CLASS_ABSTRACT.filterWindow);
            listOfDependencies.push(cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FilterForm"));
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.controller, "',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\tinject: [\n")
            _file.write("\t\t'".concat(utils.toCamelCase(object.table), "Context',\n"))
            _file.write("\t\t'".concat(utils.toCamelCase(object.table), "Service'\n"))
            _file.write("\t],\n")
            _file.write("\tconfig: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: null,\n"))
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Service: null,\n"))
            _file.write("\t\t".concat(utils.toCamelCase(object.table), ": null\n"))
            _file.write("\t},\n")
            _file.write("\tobserve: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: {\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Created: 'load", utils.toCamelCase(object.table, true), "',\n"))
            //_file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Opened: 'onExpandPanel',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Canceled: 'load", utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Deleted: 'loadInitialData'\n"))
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tcontrol: {\n")
            _file.write("\t\tview: {\n")
            _file.write("\t\t\tboxready: 'loadInitialData',\n")
            _file.write("\t\t\tselect: 'onSelectRecord',\n")
            _file.write("\t\t},\n")
            _file.write("\t\tbtnAddRecord: {\n")
            _file.write("\t\t\tclick: 'onAddRecordClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\tdeleteActionColumn: {\n")
            _file.write("\t\t\tclick: 'onActionColumnClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\tbtnFilterGrid: {\n")
            _file.write("\t\t\tclick: 'onFilterGridClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\ttextAppliedFilter: {\n")
            _file.write("\t\t},\n")
            _file.write("\t\tbtnClearFilter: {\n")
            _file.write("\t\t\tclick: 'onClearFilterClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\tbtnTrackDataEdition: {\n")
            _file.write("\t\t\tclick: 'onTrackDataEditionClick'\n")
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tinit: function() {\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            
            _file.write("\tloadInitialData: function() {\n")
            _file.write("\t\t_this = this;\n")
            _file.write("\t\t_this.getBtnTrackDataEdition().disable();\n")
            _file.write("\t\t_this.getTextAppliedFilter().setVisible(false);\n")
            _file.write("\t\t_this.getView().setLoading(true);\n")
            _file.write("\t\treturn _this.get".concat(utils.toCamelCase(object.table, true), "Service().load", utils.toCamelCase(object.table, true), "({}).then({\n"))
            _file.write("\t\t\tfailure: function(errorMessage) {\n")
            _file.write("\t\t\t\treturn _this.getNotificationService().error('Error', errorMessage);\n")
            _file.write("\t\t\t}\n")
            _file.write("\t\t}).always(function() {\n")
            _file.write("\t\t\treturn _this.getView().setLoading(false);\n")
            _file.write("\t\t});\n")
            _file.write("\t},\n")

            _file.write("\tload".concat(utils.toCamelCase(object.table, true), ": function() {\n"))
            _file.write("\t\t_this = this;\n")
            _file.write("\t\t_this.getView().setLoading(true);\n")
            _file.write("\t\treturn _this.get".concat(utils.toCamelCase(object.table, true), "Service().load", utils.toCamelCase(object.table, true), "({}).then({\n"))
            _file.write("\t\t\tfailure: function(errorMessage) {\n")
            _file.write("\t\t\t\treturn _this.getNotificationService().error('Error', errorMessage);\n")
            _file.write("\t\t\t}\n")
            _file.write("\t\t}).always(function() {\n")
            _file.write("\t\t\treturn _this.getView().setLoading(false);\n")
            _file.write("\t\t});\n")
            _file.write("\t},\n")
          
            _file.write("\tonAddRecordClick: function() {\n")
            _file.write("\t\t_this = this;\n")
            _file.write("\t\tvar nuevo".concat(utils.toCamelCase(object.table, true), " = Ext.create('", cfg.WORKSPACE.model, ".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "', {\n"))
            _file.write("\t\t\testado: 'ACTIVO'\n")
            _file.write("\t\t});\n")
            _file.write("\t\treturn _this.get".concat(utils.toCamelCase(object.table, true), "Context().", utils.toCamelCase(object.table), "Opened(nuevo", utils.toCamelCase(object.table, true), ");\n"))
            _file.write("\t},\n")
      
            _file.write("\tonSelectRecord: function(grid, record, row, rowIndex, event) {\n")
            _file.write("\t\t_this = this;\n")
            _file.write("\t\t_this.set".concat(utils.toCamelCase(object.table, true), "(record);\n"))
            _file.write("\t\treturn _this.get".concat(utils.toCamelCase(object.table, true), "Context().", utils.toCamelCase(object.table), "Opened(record);\n"))
            _file.write("\t},\n")

            _file.write("\tonActionColumnClick: function(view, cell, rowIndex, columnIndex, event, record, row){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\treturn Ext.MessageBox.confirm('Confirmar', '¿Esta seguro de eliminar el registro?', function (button) {\n")
            _file.write("\t\t\tif (button === 'yes') {\n")
            _file.write("\t\t\t\treturn _this.delete".concat(utils.toCamelCase(object.table, true), "(record);\n"))
            _file.write("\t\t\t}\n")
            _file.write("\t\t}, this);\n")
            _file.write("\t},\n")

            _file.write("\tdelete".concat(utils.toCamelCase(object.table, true), ": function (", utils.toCamelCase(object.table), ") {\n"))
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().setLoading(true);\n")
            _file.write("\t\treturn this.get".concat(utils.toCamelCase(object.table, true), "Service().delete", utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table), ").then({\n"))
            _file.write("\t\t\tsuccess: function(res) {\n")
            _file.write("\t\t\t\t_this.get".concat(utils.toCamelCase(object.table, true), "Context().", utils.toCamelCase(object.table), "Deleted();\n"))
            _file.write("\t\t\t\treturn _this.getNotificationService().success('Eliminar', res.msg);\n")
            _file.write("\t\t\t},\n")
            _file.write("\t\t\tfailure: function(errorMessage) {\n")
            _file.write("\t\t\t\treturn _this.getNotificationService().error('Eliminar', errorMessage);\n")
            _file.write("\t\t\t}\n")
            _file.write("\t\t}).always(function() {\n")
            _file.write("\t\t\treturn _this.getView().setLoading(false);\n")
            _file.write("\t\t});\n")
            _file.write("\t},\n")    

            _file.write("\tonFilterGridClick: function(){\n")
            _file.write("\t\t_this = this;\n")
            _file.write("\t\tvar filterWindow = Ext.widget('abstract-filter-window', {\n")
            _file.write("\t\t\twidth: 640,\n")
            _file.write("\t\t\ttitle: 'Filtrar ".concat(utils.toCamelCase(object.table, true), "',\n"))
            _file.write("\t\t\tgrid: _this.getView()\n")
            _file.write("\t\t});\n")
            _file.write("\t\tvar filtroForm = Ext.widget('filtro-".concat(utils.toCamelCase(object.table), "-form');\n")) 
            _file.write("\t\tfilterWindow.add(filtroForm);\n")
            _file.write("\t\tfilterWindow.show();\n")
            _file.write("\t},\n")

            _file.write("\tonClearFilterClick: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().store.proxy.extraParams = {};\n")
            _file.write("\t\t_this.getView().store.load({\n") 
            _file.write("\t\t\tcallback: function(records, operation, success){\n")
            _file.write("\t\t\t\tif(success){\n")
            _file.write("\t\t\t\t\t_this.getTextAppliedFilter().setVisible(false);\n")  
            _file.write("\t\t\t\t}\n")
            _file.write("\t\t\t}\n")
            _file.write("\t\t});\n")
            _file.write("\t},\n")
      
            _file.write("\tonTrackDataEditionClick: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\treturn _this.trackDataEdition(_this.get".concat(utils.toCamelCase(object.table, true), "().get('", utils.getIdProperty(object.columns), "'), '", object.table, "');\n"))
            _file.write("\t},\n")

            _file.write("\ttrackDataEdition: function(id, tabla){\n")
            _file.write("\t\tvar historyWindow = Ext.widget('abstract-track-data-edition-window', {\n")
            _file.write("\t\t\twidth: 640,\n")
            _file.write("\t\t\ttitle: 'Historico Edicion de Datos',\n")
            _file.write("\t\t\titems: [\n")
            _file.write("\t\t\t\t{\n")
            _file.write("\t\t\t\t\txtype: 'sglm-view-historico-form',\n")
            _file.write("\t\t\t\t\trecord: { id: id, tabla: tabla }\n")
            _file.write("\t\t\t\t}\n")
            _file.write("\t\t\t]\n")
            _file.write("\t\t});\n")
            _file.write("\t\thistoryWindow.show();\n")
            _file.write("\t}\n")

            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;  
    }
};

exports.createFormController = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.PATH.controller.concat("/", utils.toCamelCase(object.table), '/');
        shell.mkdir('-p', path);

        var filename = path.concat(utils.toCamelCase(object.table, true), 'FormController.js'); 
        var namespace = cfg.WORKSPACE.controller.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FormController")
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            var listOfDependencies = [];
            //listOfDependencies.push(cfg.CLASS_ABSTRACT.filterWindow);
            //listOfDependencies.push(cfg.WORKSPACE.view.concat(".", utils.toCamelCase(object.table), ".", utils.toCamelCase(object.table, true), "FilterForm"));
            _file.write("Ext.define('".concat(namespace,"', {\n"))
            _file.write("\textend: '".concat(cfg.CLASS_ABSTRACT.controller, "',\n"))
            _file.write("\trequires: [\n")
            listOfDependencies.forEach(function(dependencia) {
                _file.write("\t\t'" + dependencia + "',\n")
            });
            _file.write("\t],\n")
            _file.write("\tinject: [\n")
            _file.write("\t\t'".concat(utils.toCamelCase(object.table), "Context',\n"))
            _file.write("\t\t'".concat(utils.toCamelCase(object.table), "Service'\n"))
            _file.write("\t],\n")
            _file.write("\tconfig: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: null,\n"))
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Service: null,\n"))
            _file.write("\t\t".concat(utils.toCamelCase(object.table), ": null\n"))
            _file.write("\t},\n")
            _file.write("\tobserve: {\n")
            _file.write("\t\t".concat(utils.toCamelCase(object.table), "Context: {\n"))
            //_file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Created: 'onCollapsePanel',\n"))
            _file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Opened: 'on", utils.toCamelCase(object.table, true), "Opened',\n"))
            //_file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Canceled: 'onCollapsePanel',\n"))
            //_file.write("\t\t\t".concat(utils.toCamelCase(object.table), "Deleted: 'onCollapsePanel'\n"))
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tcontrol: {\n")
            _file.write("\t\tview: {\n")
            _file.write("\t\t\tboxready: 'loadInitialData',\n")
            _file.write("\t\t},\n")
            _file.write("\t\tsaveButton: {\n")
            _file.write("\t\t\tclick: 'onSaveButtonClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\tcopyButton: {\n")
            _file.write("\t\t\tclick: 'onCopyButtonClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\tcancelButton: {\n")
            _file.write("\t\t\tclick: 'onCancelButtonClick'\n")
            _file.write("\t\t},\n")
            _file.write("\t\teditButton: {\n")
            _file.write("\t\t\tclick: 'onEditButtonClick'\n")
            _file.write("\t\t}\n")
            _file.write("\t},\n")
            _file.write("\tinit: function() {\n")
            _file.write("\t\treturn this.callParent(arguments);\n")
            _file.write("\t},\n")
            
            _file.write("\tloadInitialData: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getSaveButton().setVisible(false);\n")
            _file.write("\t\t_this.getCopyButton().setVisible(false);\n")
            _file.write("\t\t_this.getEditButton().setVisible(false);\n")
            _file.write("\t\t_this.getCancelButton().setVisible(false);\n")
            _file.write("\t},\n")

            _file.write("\ton".concat(utils.toCamelCase(object.table, true), "Opened: function(", utils.toCamelCase(object.table), ") {\n"))
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().getForm().reset();\n")
            _file.write("\t\t_this.getView().setTitle('');\n")
            _file.write("\t\t_this.set".concat(utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t\t_this.getView().loadRecord(_this.get".concat(utils.toCamelCase(object.table, true), "());\n"))
            _file.write("\t\tif (_this.get".concat(utils.toCamelCase(object.table, true), "Service().isNew", utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table), ")) {\n"))
            _file.write("\t\t\t_this.getView().setReadOnlyAll(false);\n")
            _file.write("\t\t\t_this.getEditButton().setVisible(false);\n")
            _file.write("\t\t\t_this.getCopyButton().setVisible(false);\n")
            _file.write("\t\t\t_this.getSaveButton().setVisible(true);\n")
            _file.write("\t\t\t_this.getCancelButton().setVisible(true);\n")
            _file.write("\t\t} else {\n")
            _file.write("\t\t\t_this.getView().setReadOnlyAll(true);\n")
            _file.write("\t\t\t_this.getCopyButton().setVisible(true);\n")
            _file.write("\t\t\t_this.getEditButton().setVisible(true);\n")
            _file.write("\t\t\t_this.getSaveButton().setVisible(false);\n")
            _file.write("\t\t\t_this.getCancelButton().setVisible(false);\n")
            _file.write("\t\t}\n")
            _file.write("\t},\n")
     
            _file.write("\tonSaveButtonClick: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().getForm().updateRecord(_this.get".concat(utils.toCamelCase(object.table, true), "());\n"))
            _file.write("\t\treturn _this.save".concat(utils.toCamelCase(object.table, true), "(_this.get", utils.toCamelCase(object.table), "());\n"))
            _file.write("\t},\n")
     
            _file.write("\tsave".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table),") {\n"))
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().setLoading(true);\n")
            _file.write("\t\treturn _this.get".concat(utils.toCamelCase(object.table, true), "Service().save", utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table), ").then({\n"))
            _file.write("\t\t\tsuccess: function(res) {\n")
            _file.write("\t\t\t\t_this.getView().setTitle('Datos');\n")
            _file.write("\t\t\t\t_this.getCopyButton().setVisible(true);\n")
            _file.write("\t\t\t\t_this.getEditButton().setVisible(true);\n")
            _file.write("\t\t\t\t_this.getSaveButton().setVisible(false);\n")
            _file.write("\t\t\t\t_this.getCancelButton().setVisible(false);\n")
            _file.write("\t\t\t\t_this.getView().setReadOnlyAll(true);\n")
            _file.write("\t\t\t\t_this.get".concat(utils.toCamelCase(object.table, true), "Context().", utils.toCamelCase(object.table), "Created();\n"))
            _file.write("\t\t\t\treturn _this.getNotificationService().success('Guardar', res.msg);\n")
            _file.write("\t\t\t},\n")
            _file.write("\t\t\tfailure: function(errorMessage) {\n")
            _file.write("\t\t\t\treturn _this.getNotificationService().error('Guardar', errorMessage);\n")
            _file.write("\t\t\t}\n")
            _file.write("\t\t}).always(function() {\n")
            _file.write("\t\t\treturn _this.getView().setLoading(false);\n")
            _file.write("\t\t});\n")
            _file.write("\t},\n")

            _file.write("\tonCopyButtonClick: function() {\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\tvar copyOf".concat(utils.toCamelCase(object.table, true), ";\n"))
            _file.write("\t\tcopyOf".concat(utils.toCamelCase(object.table, true), "= _this.get", utils.toCamelCase(object.table, true), "().copy();\n"))
            _file.write("\t\tcopyOf".concat(utils.toCamelCase(object.table, true), ".set('", utils.getIdProperty(object.columns), "', null);\n"))
            _file.write("\t\treturn _this.on".concat(utils.toCamelCase(object.table, true), "Opened(copyOf", utils.toCamelCase(object.table, true), ");\n"))
            _file.write("\t},\n")

            _file.write("\tonCancelButtonClick: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getView().loadRecord(_this.get".concat(utils.toCamelCase(object.table, true), "());\n"))
            _file.write("\t\tif (_this.get".concat(utils.toCamelCase(object.table, true), "Service().isNew", utils.toCamelCase(object.table, true), "(_this.get", utils.toCamelCase(object.table, true), "())) {\n"))
            _file.write("\t\t\t_this.getEditButton().setVisible(false);\n")
            _file.write("\t\t\t_this.getCopyButton().setVisible(false);\n")
            _file.write("\t\t} else {\n")
            _file.write("\t\t\t_this.getCopyButton().setVisible(true);\n")
            _file.write("\t\t\t_this.getEditButton().setVisible(true);\n")
            _file.write("\t\t}\n")
            _file.write("\t\t_this.getCancelButton().setVisible(false);\n")
            _file.write("\t\t_this.getSaveButton().setVisible(false);\n")
            _file.write("\t\t_this.getView().setReadOnlyAll(true);\n")
            _file.write("\t\t_this.get".concat(utils.toCamelCase(object.table, true), "Context().", utils.toCamelCase(object.table), "Canceled();\n"))
            _file.write("\t},\n")

            _file.write("\tonEditButtonClick: function(){\n")
            _file.write("\t\tvar _this = this;\n")
            _file.write("\t\t_this.getSaveButton().setVisible(true);\n")
            _file.write("\t\t_this.getCancelButton().setVisible(true);\n")
            _file.write("\t\t_this.getCopyButton().setVisible(false);\n")
            _file.write("\t\t_this.getEditButton().setVisible(false);\n")
            _file.write("\t\t_this.getView().setReadOnlyAll(false);\n")
            _file.write("\t},\n")

            _file.write("});")
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;  
    }
};

exports.createHandler = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.BACKEND_PATH.handlers.concat("/"/*, utils.toCamelCase(object.table), '/'*/);
        shell.mkdir('-p', path);
        var filename = path.concat(utils.toCamelCase(object.table), "Handler.js");
        console.log(filename);
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            _file.write("var ".concat(utils.toCamelCase(object.table), "Service = require('../services/", utils.toCamelCase(object.table), "Service.js');\n"))
            _file.write("var tokenService       = require('../services/tokenService');\n")
            _file.write("var jwt                = require('jsonwebtoken');\n")
            _file.write("var cfg                = require('config');\n")
            _file.write("var _                  = require('lodash');\n")
            _file.write("var filterService      = require('../services/filterService');\n")      
            _file.write("\n")    
            _file.write("var ".concat(utils.toCamelCase(object.table), "Handler = function() {\n"))
            _file.write("\tthis.get".concat(utils.toCamelCase(object.table, true), "= handleGet", utils.toCamelCase(object.table, true), "Request;\n"))
            _file.write("\tthis.create".concat(utils.toCamelCase(object.table, true), "= handleCreate", utils.toCamelCase(object.table, true), "Request;\n"))
            _file.write("\tthis.update".concat(utils.toCamelCase(object.table, true), "= handleUpdate", utils.toCamelCase(object.table, true), "Request;\n"))
            _file.write("\tthis.delete".concat(utils.toCamelCase(object.table, true), "= handleDelete", utils.toCamelCase(object.table, true), "Request;\n"))
            _file.write("}\n")
            _file.write("\n")
            _file.write("function handleGet".concat(utils.toCamelCase(object.table, true), "Request(req, res, next) {\n"))
            _file.write("\tvar token = tokenService.getToken(req);\n")
            _file.write("\tvar payload = jwt.decode(token, {complete: true}).payload;\n")
            _file.write("\tvar ".concat(utils.toCamelCase(object.table), "= filterService.removeKeysNull(req.query);\n"))
            _file.write("\tvar paging = {\n")
            _file.write("\t\tlimit: req.query.limit || 1000,\n")
            _file.write("\t\tstart: req.query.start || 0\n")
            _file.write("\t};\n")
            _file.write("\tvar order = '\"' + req.query.sort + '\"' + ' ' +  req.query.dir;\n")
            _file.write("\tvar service = ".concat(utils.toCamelCase(object.table), "Service({username: payload.username, password: payload.password});\n"))
            _file.write("\tservice.getAll".concat(utils.toCamelCase(object.table, true), "(", utils.toCamelCase(object.table),", paging, order).then(function(result){\n"))
            _file.write("\t\tres.status(200).send({\n")
            _file.write("\t\t\tsuccess: true,\n")
            _file.write("\t\t\trows: result.rows,\n")
            _file.write("\t\t\ttotal: result.count\n")
            _file.write("\t\t})\n")
            _file.write("\t}, function(err){\n")
            _file.write("\t\tres.status(500);\n")
            _file.write("\t\tres.send(err);\n")
            _file.write("\t\treturn next(new Error(err));\n")
            _file.write("\t})\n")
            _file.write("}\n")
            _file.write("\n")
            _file.write("function handleCreate".concat(utils.toCamelCase(object.table, true), "Request(req, res, next) {\n"))
            _file.write("\tvar token = tokenService.getToken(req);\n")
            _file.write("\tvar payload = jwt.decode(token, {complete: true}).payload;\n")
            _file.write("\tvar service = ".concat(utils.toCamelCase(object.table), "Service({username: payload.username, password: payload.password});\n"))
            _file.write("\tservice.create".concat(utils.toCamelCase(object.table, true), "(req.body).then(function(result){\n"))
            _file.write("\t\tres.status(201).send({\n")
            _file.write("\t\t\tsuccess: true,\n")
            _file.write("\t\t\tdata: result,\n")
            _file.write("\t\t\tmsg: cfg.get('COMMON.success')\n") 
            _file.write("\t\t})\n")
            _file.write("\t}, function(err){\n")
            _file.write("\t\tres.status(500);\n")
            _file.write("\t\tres.send(err);\n")
            _file.write("\t\treturn next(new Error(err));\n")
            _file.write("\t})\n")
            _file.write("}\n")
            _file.write("\n")
            _file.write("function handleUpdate".concat(utils.toCamelCase(object.table, true), "Request(req, res, next) {\n"))
            _file.write("\tvar token = tokenService.getToken(req);\n")
            _file.write("\tvar payload = jwt.decode(token, {complete: true}).payload;\n")
            _file.write("\tvar service = ".concat(utils.toCamelCase(object.table), "Service({username: payload.username, password: payload.password});\n"))
            _file.write("\tservice.update".concat(utils.toCamelCase(object.table, true), "(req.body).then(function(result){\n"))
            _file.write("\t\tres.status(201).send({\n")
            _file.write("\t\t\tsuccess: true,\n")
            _file.write("\t\t\tdata: result,\n")
            _file.write("\t\t\tmsg: cfg.get('COMMON.success')\n") 
            _file.write("\t\t})\n")
            _file.write("\t}, function(err){\n")
            _file.write("\t\tres.status(500);\n")
            _file.write("\t\tres.send(err);\n")
            _file.write("\t\treturn next(new Error(err));\n")
            _file.write("\t})\n")
            _file.write("}\n")
            _file.write("\n")
            _file.write("function handleDelete".concat(utils.toCamelCase(object.table, true), "Request(req, res, next) {\n"))
            _file.write("\tvar token = tokenService.getToken(req);\n")
            _file.write("\tvar payload = jwt.decode(token, {complete: true}).payload;\n")
            _file.write("\tvar service = ".concat(utils.toCamelCase(object.table), "Service({username: payload.username, password: payload.password});\n"))
            _file.write("\tservice.delete".concat(utils.toCamelCase(object.table, true), "(req.body).then(function(result){\n"))
            _file.write("\t\tres.status(201).send({\n")
            _file.write("\t\t\tsuccess: true,\n")
            _file.write("\t\t\tdata: result,\n")
            _file.write("\t\t\tmsg: cfg.get('COMMON.success')\n") 
            _file.write("\t\t})\n")
            _file.write("\t}, function(err){\n")
            _file.write("\t\tres.status(500);\n")
            _file.write("\t\tres.send(err);\n")
            _file.write("\t\treturn next(new Error(err));\n")
            _file.write("\t})\n")
            _file.write("}\n")
            _file.write("\n")

            _file.write("module.exports = ".concat(utils.toCamelCase(object.table), "Handler;"))
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;  
    }
};

exports.createBackendService = function(object){
    var deferred = q.defer();
    try {
        var path = cfg.BACKEND_PATH.services.concat("/"/*, utils.toCamelCase(object.table), '/'*/);
        shell.mkdir('-p', path);
        var filename = path.concat(utils.toCamelCase(object.table), 'Service.js'); /* Nombre de Archivo formato Capitalize */
        fs.truncate(filename, 0, function(){
           var _file = fs.createWriteStream(filename, {
                flags: 'a' 
            })
            _file.write("var q = require('q');\n")
            _file.write("\n")
            _file.write("module.exports = function(connection){\n")
            _file.write("\tvar db = require('../model');\n")
            _file.write("\tdb.setup(process.env.DATA_BASE, connection.username, connection.password, {\n")
            _file.write("\t\thost: process.env.DB_SERVER,\n")
            _file.write("\t\tlogging: false,\n")
            _file.write("\t\tnative: false\n")
            _file.write("\t});\n")
            _file.write("\n")
            _file.write("\tvar ".concat(utils.toCamelCase(object.table), "= db.model('public.", utils.toCamelCase(object.table), "');\n"))
            object.columns.forEach(function(column){
                if(column.foreignkey){
                    _file.write("\tvar ".concat(utils.toCamelCase(column.foreignkey), "= db.model('public.", utils.toCamelCase(column.foreignkey), "');\n"))
                }
            })
            _file.write("\n")
            _file.write("\tvar getAll".concat(utils.toCamelCase(object.table, true), "= function(filter, paging, order){\n"))
            _file.write("\t\treturn ".concat(utils.toCamelCase(object.table), ".findAndCountAll({\n"))
            _file.write("\t\t\twhere: filter,\n")
            _file.write("\t\t\tlimit: paging.limit,\n")
            _file.write("\t\t\toffset: paging.start,\n")
            _file.write("\t\t\torder: order,\n")
            _file.write("\t\t\tinclude: [\n")
            object.columns.forEach(function(column){
                if(column.foreignkey){
                    _file.write("\t\t\t\t{ model: ".concat(utils.toCamelCase(column.foreignkey),", as: '", utils.toCamelCase(column.foreignkey), "'},\n"))
                }
            })
            _file.write("\t\t\t]\n")
            _file.write("\t\t})\n")
            _file.write("\t}\n")
            _file.write("\n")
            _file.write("\tvar create".concat(utils.toCamelCase(object.table, true), "= function(_", utils.toCamelCase(object.table), "){\n"))
            _file.write("\t\treturn ".concat(utils.toCamelCase(object.table), ".create(_", utils.toCamelCase(object.table), ");\n"))
            _file.write("\t};\n")
            _file.write("\n")
            _file.write("\tvar update".concat(utils.toCamelCase(object.table, true), "= function(_", utils.toCamelCase(object.table), "){\n"))
            _file.write("\t\treturn ".concat(utils.toCamelCase(object.table), ".update(_", utils.toCamelCase(object.table), ", { where: { ", utils.getIdProperty(object.columns), ": ", utils.toCamelCase(object.table), ".", utils.getIdProperty(object.columns), "}});\n"))
            _file.write("\t};\n")
            _file.write("\n")
            _file.write("\tvar delete".concat(utils.toCamelCase(object.table, true), "= function(_", utils.toCamelCase(object.table), "){\n"))
            _file.write("\t\treturn ".concat(utils.toCamelCase(object.table), ".destroy(_", utils.toCamelCase(object.table), ", { where: { ", utils.getIdProperty(object.columns), ": ", utils.toCamelCase(object.table), ".", utils.getIdProperty(object.columns), "}});\n"))
            _file.write("\t};\n")
            _file.write("\n")
            _file.write("\treturn {\n")
            _file.write("\t\tgetAll".concat(utils.toCamelCase(object.table, true), ": getAll", utils.toCamelCase(object.table, true), ",\n"))
            _file.write("\t\tcreate".concat(utils.toCamelCase(object.table, true), ": create", utils.toCamelCase(object.table, true), ",\n"))
            _file.write("\t\tupdate".concat(utils.toCamelCase(object.table, true), ": update", utils.toCamelCase(object.table, true), ",\n"))
            _file.write("\t\tdelete".concat(utils.toCamelCase(object.table, true), ": delete", utils.toCamelCase(object.table, true), ",\n"))
            _file.write("\t}\n")
            _file.write("};")    
            _file.end();
        })
        deferred.resolve(true);
    }
    catch(error){
        deferred.reject(false);
    }
    finally {
        return deferred.promise;  
    }
};


/*{
    "success": true,
    "grid": true,
    "form": true,
    "table": "departamentos",
    "fieldsets": [
        {
            "title": "FieldSet1",
            "columns": 2,
            "fields": [
                {
                    "number": 1,
                    "name": "departamento_id",
                    "attnum": 1,
                    "notnull": true,
                    "type": "integer",
                    "primarykey": "t",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": "nextval('departamentos_departamento_id_seq'::regclass)"
                },
                {
                    "number": 2,
                    "name": "nombre",
                    "attnum": 2,
                    "notnull": false,
                    "type": "character varying(50)",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": null
                },
                {
                    "input": "combo",
                    "displayField": "",
                    "valueField": "",
                    "store": "lista",
                    "params:" "nombre: 'A'",
                    "number": 3,
                    "name": "modelo_departamento_id",
                    "attnum": 3,
                    "notnull": false,
                    "type": "integer",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": "modelo_departamento",
                    "foreignkey_fieldnum": [
                        1
                    ],
                    "foreignkey_connnum": [
                        3
                    ],
                    "default": null,
                  "fields": [
                    { "name" : "tipo"},
                    { "name" : "superficie"},
                    { "name" : "numero_habitantes"}
                  ]
                }
            ]
        },
        {
          "title": "FieldSet2",
            "columns": 2,
            "fields": [
                {
                    "number": 1,
                    "name": "departamento_id",
                    "attnum": 1,
                    "notnull": true,
                    "type": "integer",
                    "primarykey": "t",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": "nextval('departamentos_departamento_id_seq'::regclass)"
                },
                {
                    "number": 2,
                    "name": "nombre",
                    "attnum": 2,
                    "notnull": false,
                    "type": "character varying(50)",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": null
                },
                {
                    "number": 3,
                    "name": "modelo_departamento_id",
                    "attnum": 3,
                    "notnull": false,
                    "type": "integer",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": "modelo_departamento",
                    "foreignkey_fieldnum": [
                        1
                    ],
                    "foreignkey_connnum": [
                        3
                    ],
                    "default": null,
                  "fields": [
                    { "name" : "tipo"},
                    { "name" : "superficie"},
                    { "name" : "numero_habitantes"}
                  ]
                }
            ]  
        }
    ],
    "columns": [
        {
            "number": 1,
            "name": "departamento_id",
            "attnum": 1,
            "notnull": true,
            "type": "integer",
            "primarykey": "t",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": "nextval('departamentos_departamento_id_seq'::regclass)"
        },
        {
            "number": 2,
            "name": "nombre",
            "attnum": 2,
            "notnull": false,
            "type": "character varying(50)",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": null
        },
        {
            "number": 3,
            "name": "modelo_departamento_id",
            "attnum": 3,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": "modelo_departamento",
            "foreignkey_fieldnum": [
                1
            ],
            "foreignkey_connnum": [
                3
            ],
            "default": null,
          "fields": [
            { "name" : "tipo"},
            { "name" : "superficie"},
            { "name" : "numero_habitantes"}
          ]
        },
        {
            "number": 4,
            "name": "propietario_id",
            "attnum": 4,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": "propietarios",
            "foreignkey_fieldnum": [
                1
            ],
            "foreignkey_connnum": [
                4
            ],
            "default": null
           
        },
        {
            "number": 5,
            "name": "cantidad_habitantes",
            "attnum": 5,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": null
        },
        {
            "number": 6,
            "name": "fecha_registro",
            "attnum": 6,
            "notnull": false,
            "type": "timestamp without time zone",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": "now()"
        }
    ]
}

{
  "path": "D:/test/app",  
  "host": "localhost",
  "port": 5432,
  "schema": "public",
  "database": "sacec",
  "dbusername": "palvarado",
  "dbpassword": "palvarado",
  "success": true,
    "grid": true,
    "form": true,
    "table": "departamentos",
    "fieldsets": [
        {
           "name": "Formulario1",
            "title": "FieldSet1",
            "columns": 2,
            "fields": [
                {
                    "number": 1,
                    "name": "departamento_id",
                    "attnum": 1,
                    "notnull": true,
                    "type": "integer",
                    "primarykey": "t",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": "nextval('departamentos_departamento_id_seq'::regclass)"
                },
                {
                    "number": 2,
                    "name": "nombre",
                    "attnum": 2,
                    "notnull": false,
                    "type": "character varying(50)",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": null
                },
                {
                    "input": "combo",
                    "displayField": "nombre",
                    "valueField": "modelo_departamento_id",
                    "store": "lista",
                    "params" : "nombre",
                    "number": 3,
                    "name": "modelo_departamento_id",
                    "attnum": 3,
                    "notnull": false,
                    "type": "integer",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": "modelo_departamento",
                    "foreignkey_fieldnum": [
                        1
                    ],
                    "foreignkey_connnum": [
                        3
                    ],
                    "default": null,
                  "fields": [
                    { "name" : "tipo"},
                    { "name" : "superficie"},
                    { "name" : "numero_habitantes"}
                  ]
                }
            ]
        },
        {
            "name": "Formulario2",
            "title": "FieldSet2",
            "columns": 2,
            "fields": [
                {
                    "number": 1,
                    "name": "departamento_id",
                    "attnum": 1,
                    "notnull": true,
                    "type": "integer",
                    "primarykey": "t",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": "nextval('departamentos_departamento_id_seq'::regclass)"
                },
                {
                    "number": 2,
                    "name": "nombre",
                    "attnum": 2,
                    "notnull": false,
                    "type": "character varying(50)",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": null,
                    "foreignkey_fieldnum": null,
                    "foreignkey_connnum": null,
                    "default": null
                },
                {
                    "number": 3,
                    "name": "modelo_departamento_id",
                    "attnum": 3,
                    "notnull": false,
                    "type": "integer",
                    "primarykey": "f",
                    "uniquekey": "f",
                    "foreignkey": "modelo_departamento",
                    "foreignkey_fieldnum": [
                        1
                    ],
                    "foreignkey_connnum": [
                        3
                    ],
                    "default": null,
                  "fields": [
                    { "name" : "tipo"},
                    { "name" : "superficie"},
                    { "name" : "numero_habitantes"}
                  ]
                }
            ]  
        }
    ],
    "columns": [
        {
            "number": 1,
            "name": "departamento_id",
            "attnum": 1,
            "notnull": true,
            "type": "integer",
            "primarykey": "t",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": "nextval('departamentos_departamento_id_seq'::regclass)"
        },
        {
            "number": 2,
            "name": "nombre",
            "attnum": 2,
            "notnull": false,
            "type": "character varying(50)",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": null
        },
        {
            "number": 3,
            "name": "modelo_departamento_id",
            "attnum": 3,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": "modelo_departamento",
            "foreignkey_fieldnum": [
                1
            ],
            "foreignkey_connnum": [
                3
            ],
            "default": null,
          "fields": [
            { "name" : "tipo"},
            { "name" : "superficie"},
            { "name" : "numero_habitantes"}
          ]
        },
        {
            "number": 4,
            "name": "propietario_id",
            "attnum": 4,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": "propietarios",
            "foreignkey_fieldnum": [
                1
            ],
            "foreignkey_connnum": [
                4
            ],
            "default": null
           
        },
        {
            "number": 5,
            "name": "cantidad_habitantes",
            "attnum": 5,
            "notnull": false,
            "type": "integer",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": null
        },
        {
            "number": 6,
            "name": "fecha_registro",
            "attnum": 6,
            "notnull": false,
            "type": "timestamp without time zone",
            "primarykey": "f",
            "uniquekey": "f",
            "foreignkey": null,
            "foreignkey_fieldnum": null,
            "foreignkey_connnum": null,
            "default": "now()"
        }
    ]
}


*/

