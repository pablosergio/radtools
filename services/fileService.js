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
                _file.write("\t\tmodel: '".concat(cfg.WORKSPACE.model, ".", utils.toCamelCase(column.foreignkey), '.', utils.toCamelCase(column.foreignkey, true), "Model", "',\n"))
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

    deferred.resolve(true);
    return deferred.promise;    
};

exports.createService = function(object){
    var deferred = q.defer();
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
        _file.write("\t\tthis.initConfig(config);\n")
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
        _file.write("\t\tvar store = Ext.create('".concat(cfg.WORKSPACE, ".store.", utils.toCamelCase(object.table),".", utils.toCamelCase(object.table, true), "Store');\n"))
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
        _file.write("\t\t},\n")
        _file.write("\t\treturn this.sync".concat(utils.toCamelCase(object.table, true), "Store();\n"))
        _file.write("\t},\n")
        _file.write("\n")

        /* Function Delete */
        _file.write("\t/* Description: Delete ".concat(utils.toCamelCase(object.table, true), " */\n"))
        _file.write("\t/* Params: params = Objet ".concat(utils.toCamelCase(object.table, true), " */\n")) 
        _file.write("\t/* Return: Run sync".concat(utils.toCamelCase(object.table, true), "Store() */\n"))
        _file.write("\tdelete".concat(utils.toCamelCase(object.table, true), ": function(", utils.toCamelCase(object.table), ") {\n"))
        _file.write("\t\t\tthis.get".concat(utils.toCamelCase(object.table, true), "().remove(", utils.toCamelCase(object.table),");\n"))
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

    deferred.resolve(true);
    return deferred.promise;    
};

exports.createContext = function(object){
    var deferred = q.defer();
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

    deferred.resolve(true);
    return deferred.promise;    
};

exports.createMainPanel = function(object){
    var deferred = q.defer();
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
            _file.write("\t\t\twidth: '".concat(cfg.WIDTH.panel.region.east, "'\n"))
            _file.write("\t\t\tcollapsible: true,\n")
            _file.write("\t\t\titemId: 'panelCollapsible".concat(utils.toCamelCase(object.table, true), "'\n"))
            _file.write("\t\t},\n")        
        }    
        _file.write("\t]\n")
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;
};

exports.createGrid = function(object){
    var deferred = q.defer();
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
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;  
};

exports.createForm = function(object){
    var deferred = q.defer();
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
        _file.write("\tinject: ['".concat(utils.toCamelCase(object.table), "Store'],\n"))
        _file.write("\tconfig: {\n")
        _file.write("\t\t".concat(utils.toCamelCase(object.table), "Store: null\n"))
        _file.write("\t},\n")
        _file.write("\tinitComponent: function() {\n")
        _file.write("\t\tvar _this = this;\n")
        object.columns.forEach(function(column) {
            if(column.foreignkey)
                _file.write("\t\t_this.".concat(utils.toCamelCase(column.foreignkey), "Store = Ext.create('", cfg.WORKSPACE.store, ".", utils.toCamelCase(column.foreignkey), ".", utils.toCamelCase(column.foreignkey, true), ".Store');\n"));
        });
        
        if(object.fieldsets.length > 0){
            object.fieldsets.forEach(function(fieldset) {
                _file.write("\t\t_this.".concat(utils.toCamelCase(fieldset.name), " = ", utils.convertToForm(fieldset.columns, fieldset.fields, null, null, 2), "\n"));
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
        _file.write("});")
        _file.end();
    })

    deferred.resolve(true);
    return deferred.promise;  
};

exports.createViewFilterForm = function(object){

}

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
*/

