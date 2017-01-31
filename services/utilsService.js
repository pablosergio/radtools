/**
 * Created by Vanessa on startInject17.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var _  = require('lodash');
  cfg  = require('config');
   fs  = require('fs')

exports.findLine = function(filename, annotation1, annotation2, match){
    var _this = this;
    var found = false;
    //var filename = cfg.PATH.context.concat("/Application.js"), '/');
    var data = fs.readFileSync(filename).toString().split("\n");
    var startInjectLine = 0;
    var endInjectLine = 0;
    var data = fs.readFileSync(filename).toString().split("\n");
    for (var i = 0; i < data.length; i++) {
        if(data[i].indexOf(annotation1) > 0){
            startInjectLine = i;
            endInjectLine = startInjectLine + 1;
        }
        if(data[i].indexOf(annotation2) > 0){
            endInjectLine = i;
        }
    }

    for (var i = 0; i < data.length; i++) {
        if(data[i].indexOf(match) > 0){
            if(i > startInjectLine && i < endInjectLine){
                found = true;    
            }
        }
    }
    
    return found;
};

exports.injectPackage = function(filename, annotation, package){
    var _this = this;
    var lineNumber;
    //var filename = cfg.PATH.context.concat("/Application.js"), '/');
    var data = fs.readFileSync(filename).toString().split("\n");
    for (var i = 0; i < data.length; i++) {
        if(data[i].indexOf(annotation) > 0){
            lineNumber = i + 1;
        }
    }
    data.splice(lineNumber, 0, package);
    var text = data.join("\n");
    fs.writeFileSync(filename, text)
};

exports.getType = function(type){
    var field = {
        type: 'string',
        size: 0
    };
    
    switch(type){
        case String(type.match(/^integer.*/)):
           field.type = "int";
           field.size = this.getSize(type);
            break;
        case String(type.match(/^numeric.*/)):
           field.type = "decimal";
           field.size = this.getSize(type);
            break;
        case String(type.match(/^character.*/)):
            field.type = "string";
            field.size = this.getSize(type);
            break;
        case String(type.match(/^timestamp.*/)):
            field.type = "date";
            field.size = this.getSize(type);
            break;
    }
    //return _type;
    return field;
};

exports.getSize = function(type){
    var size = 0;
    var start = type.indexOf("(");
    if(start > -1){
        var end = type.indexOf(")");
        size = type.substring(start + 1, end);
    }
    return size;
};

exports.getIdProperty = function(columns){
    var idProperty = null;
    columns.forEach(function(column){
        if(column.primarykey === 't')
            idProperty = column.name;
    })
    return idProperty;
};

exports.toCamelCase = function(str, isCapitalize){
    var index = [];
    for(i=0; i < str.length; i++){
        if(str.charAt(i) === '_'){
            index.push(i);
        }
    }
    
    for(i=0; i < index.length; i++){
        var _char = str.charAt(index[i] + 1).toUpperCase();
        
        str = replaceAt(str, index[i] + 1, _char);
        function replaceAt(string, index, replace) {
                return string.substring(0, index) + replace + string.substring(index + 1);
        }   
    }

    str = str.replace(/_/gi, '');
    if(isCapitalize)
       str = str.replace(/\b\w/g, function(l){ return l.toUpperCase() })
    else
       str = str.replace(/\b\w/g, function(l){ return l.toLowerCase() })
    
    return str;
};

exports.convertToColumn = function(column){
    var header = column.name.toUpperCase();
        header = header.replace(/_/gi, ' ');
        header = header.replace(/ID/gi, '');
    var col = "\t\t\t\t{\n" +
             "\t\t\t\t\theader: '".concat(header, "',\n") +
             "\t\t\t\t\tdataIndex: '".concat(column.name, "',\n") +
             "\t\t\t\t\tflex: 1,\n" +
             "\t\t\t\t\talign: 'center',\n"  +
             "\t\t\t\t\trenderer: function(value, metaData, record, row, col, store, gridView) {\n" +
             "\t\t\t\t\t\treturn value;\n" +
             "\t\t\t\t\t}\n" +
             "\t\t\t\t},";

     if(this.getType(column.type).type == 'date'){
        var format = column.format ? column.format : 'Y-m-d';
        col = "\t\t\t\t{\n" +
             "\t\t\t\t\txtype: 'datecolumn',\n" +
             "\t\t\t\t\theader: '".concat(header, "',\n") +
             "\t\t\t\t\tdataIndex: '".concat(column.name, "',\n") +
             "\t\t\t\t\twidth: 90,\n" +
             "\t\t\t\t\talign: 'center',\n"  +
             "\t\t\t\t\tformat: '".concat(format, "',\n")  +
             "\t\t\t\t},";
        return col;   
     }

     if(column.foreignkey && column.fields && column.fields.length == 1){
        col ="\t\t\t\t{\n" +
             "\t\t\t\t\theader: '".concat(header, "',\n") +
             "\t\t\t\t\tdataIndex: '".concat(column.name, "',\n") +
             "\t\t\t\t\tflex: 1,\n" +
             "\t\t\t\t\talign: 'center',\n"  +
             "\t\t\t\t\trenderer: function(value, metaData, record, row, col, store, gridView) {\n" +
             "\t\t\t\t\t\treturn record.get('".concat( this.toCamelCase(column.foreignkey), "').", column.fields[0].name, ";\n") +
             "\t\t\t\t\t}\n" +
             "\t\t\t\t},";
        return col;     
     }   

     if(column.foreignkey && column.fields && column.fields.length > 1){
        col = "\t\t\t\t{\n" +
                "\t\t\t\t\txtype: 'templatecolumn',\n" +
                "\t\t\t\t\theader: '".concat(header, "',\n") +
                "\t\t\t\t\tdataIndex: '".concat(column.name, "',\n") +
                "\t\t\t\t\tflex: 1,\n" + 
                "\t\t\t\t\talign: 'left',\n" +
                "\t\t\t\t\t".concat(this.getTpl(column), "\n") +
                "\t\t\t\t},"
        return col;         
     }
    return col;
};

exports.getTpl = function(column){
    var _this = this;
    var tpl = 'tpl: '
    column.fields.forEach(function(field){
        header = field.name.replace(/_/gi, ' ');
        header = header.replace(/ID/gi, '');
        var htmlTpl = "'<strong>".concat(header, ":</strong>{",  _this.toCamelCase(column.foreignkey), ".", field.name, "}</br>' +\n\t\t\t\t\t\t");
        tpl += htmlTpl;
    })
    tpl = tpl.substring(0, tpl.length - 15);
    tpl = tpl.concat("'");
    return tpl;
};

exports.convertToFieldSet = function(fieldset, identation){
    var _this = this;
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }
    var _fieldset = "";
        _fieldset = _fieldset.concat(_identation, "\t{\n");
        _fieldset = _fieldset.concat(_identation, "\t\txtype: 'fieldset',\n");
        _fieldset = _fieldset.concat(_identation, "\t\ttitle: '", fieldset.title,"',\n");
        _fieldset = _fieldset.concat(_identation, "\t\tcollapsible: false,\n");
        _fieldset = _fieldset.concat(_identation, "\t\tmargin: 20,\n");
        _fieldset = _fieldset.concat(_identation, "\t\titems: [\n");
        _fieldset = _fieldset.concat(_identation, "\t\t\t{ xtype: _this.".concat(_this.toCamelCase(fieldset.name), " }\n"));            
        _fieldset = _fieldset.concat(_identation, "\t\t]\n");
        _fieldset = _fieldset.concat(_identation, "\t},\n");
    
    return _fieldset;    
};

exports.convertToForm = function(columns, fields, title, icon, identation, isFilterForm){
    var _this = this;
    var _title = title ? "'".concat(title, "'") :  null;
    var _icon = icon ? "'".concat(icon, "'") :  null;
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }

    var form = "Ext.create('Ext.form.Panel', {\n";
    form = form.concat(_identation, "\ttitle: ", _title, ",\n");
    form = form.concat(_identation,"\tbodyStyle: {\n");
    form = form.concat(_identation,"\t\tbackground: '#F0F4F9',\n");
    form = form.concat(_identation,"\t\tfont: '12px Georgia, \"Times New Roman\", Times, serif',\n");
    form = form.concat(_identation,"\t\tcolor: '#888',\n");
    form = form.concat(_identation,"\t\tborder:'1px solid #E4E4E4'\n");
    form = form.concat(_identation,"\t},\n");
    form = form.concat(_identation,"\tborder: null,\n");
    form = form.concat(_identation,"\tlabelStyle: 'font-weight:bold;font-size:10px!important;',\n");
    form = form.concat(_identation,"\ticonCls: ", _icon, ",\n");
    form = form.concat(_identation,"\tlayout: {\n");
    form = form.concat(_identation,"\t\ttype: 'table',\n");
    form = form.concat(_identation,"\t\tcolumns: ", columns, ",\n");
    form = form.concat(_identation,"\t\ttableAttrs: {\n");
    form = form.concat(_identation,"\t\t\tstyle: {\n");
    form = form.concat(_identation,"\t\t\t\twidth: '100%'\n");
    form = form.concat(_identation,"\t\t\t}\n");
    form = form.concat(_identation,"\t\t}\n");
    form = form.concat(_identation,"\t},\n");
    form = form.concat(_identation,"\titems: [\n");
        fields.forEach(function(field){
            form = form.concat(_this.convertToWidget(field, identation + 1, isFilterForm));        
        })
    form = form.concat(_identation,"\t]\n");
    form = form.concat(_identation,"});\n");
    return form;
};

exports.convertToWidget = function(field, identation, isFilterForm){
    var _this = this;
    var widget = "";
    var _type = _this.getType(field.type);
    switch(_type.type){
        case 'string':
            if(field.input == 'combo'){
                widget = _this.convertToComboBox(field, identation, isFilterForm)
            }else{
                widget = _this.convertToTextField(field, 50, identation, isFilterForm);
            }
            break;
        case 'int':
            if(field.input == 'combo'){
                widget = _this.convertToComboBox(field, identation, isFilterForm)
            }else{
                widget = _this.convertToNumberField(field, 50, identation, isFilterForm);
            }
            break;
        case 'decimal':
            if(field.input == 'combo'){
                widget = _this.convertToComboBox(field, identation, isFilterForm)
            }else{
                widget = _this.convertToNumberField(field, 50, identation, isFilterForm);
            }
            break;
        case 'date':
            widget = _this.convertToDateField(field, 50, identation, isFilterForm);
            break;
    }
    return widget;
}

exports.convertToTextField = function(field, size, identation, isFilterForm){
    var _this = this;
    var label = field.name.toUpperCase();
        label = label.replace(/_/gi, ' ');
    if(field.foreignkey)
        label = label.replace(/ID/gi, '');
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }
    var textfield = _identation.concat("{\n");
    textfield = textfield.concat(_identation, "\txtype: 'textfield',\n");
    textfield = textfield.concat(_identation, "\tname: '", field.name, "',\n");
    textfield = textfield.concat(_identation, "\tfieldLabel: '", label, "',\n");
    textfield = textfield.concat(_identation, "\tlabelAlign: 'right',\n");
    textfield = textfield.concat(_identation, "\tlabelWidth: 120,\n");
    textfield = textfield.concat(_identation, "\tlabelStyle: 'font-weight:bold;font-size:10px!important;',\n");
    textfield = textfield.concat(_identation, "\temptyText: 'Ingresar...',\n");
    textfield = textfield.concat(_identation, "\tplugins: ['clearbutton'],\n");
    if(field.notnull && !isFilterForm){
        textfield = textfield.concat(_identation, "\tallowBlank: false,\n");
        textfield = textfield.concat(_identation, "\tafterLabelTextTpl: this.getRequiredStyle(),\n");
    }
    textfield = textfield.concat(_identation, "\tmargin: 10,\n");
    textfield = textfield.concat(_identation, "\tmaxLength: ", size ? size : 250,",\n");
    textfield = textfield.concat(_identation, "\tenforceMaxLength: true,\n");
    if(field.primarykey == 't')
        textfield = textfield.concat(_identation, "\thidden: true,\n");
    else    
        textfield = textfield.concat(_identation, "\thidden: ", field.hidden || false, ",\n");
    textfield = textfield.concat(_identation, "\treadOnly: ", field.readOnly || false, ",\n");
    textfield = textfield.concat(_identation, "\tmaskRe: ", field.maskRe || null, ",\n");
    textfield = textfield.concat(_identation, "\tregex: ", field.regex || null, ",\n");
    textfield = textfield.concat(_identation, "},\n");
                    
    return textfield;
}

exports.convertToNumberField = function(field, size, identation, isFilterForm){
    var _this = this;
    var label = field.name.toUpperCase();
        label = label.replace(/_/gi, ' ');
    if(field.foreignkey)
        label = label.replace(/ID/gi, '');
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }
    var numberfield = _identation.concat("{\n");
    numberfield = numberfield.concat(_identation, "\txtype: 'numberfield',\n");
    numberfield = numberfield.concat(_identation, "\tname: '", field.name, "',\n");
    numberfield = numberfield.concat(_identation, "\tfieldLabel: '", label, "',\n");
    numberfield = numberfield.concat(_identation, "\tlabelAlign: 'right',\n");
    numberfield = numberfield.concat(_identation, "\tlabelWidth: 120,\n");
    numberfield = numberfield.concat(_identation, "\tlabelStyle: 'font-weight:bold;font-size:10px!important;',\n");
    numberfield = numberfield.concat(_identation, "\temptyText: 'Ingresar...',\n");
    numberfield = numberfield.concat(_identation, "\tplugins: ['clearbutton'],\n");
    if(field.notnull && !isFilterForm){
        numberfield = numberfield.concat(_identation, "\tallowBlank: false,\n");
        numberfield = numberfield.concat(_identation, "\tafterLabelTextTpl: this.getRequiredStyle(),\n");
    }
    numberfield = numberfield.concat(_identation, "\tmargin: 10,\n");
    numberfield = numberfield.concat(_identation, "\tmaxLength: ", size ? size : 250,",\n");
    numberfield = numberfield.concat(_identation, "\tenforceMaxLength: true,\n");
    if(field.primarykey == 't')
        numberfield = numberfield.concat(_identation, "\thidden: true,\n");
    else    
        numberfield = numberfield.concat(_identation, "\thidden: ", field.hidden || false, ",\n");
    numberfield = numberfield.concat(_identation, "},\n");

    return numberfield;
};

exports.convertToDateField = function(field, formatdate, identation, isFilterForm){
    var _this = this;
    var label = field.name.toUpperCase();
        label = label.replace(/_/gi, ' ');
    if(field.foreignkey)
        label = label.replace(/ID/gi, '');
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }
    var datefield = _identation.concat("{\n");
    datefield = datefield.concat(_identation, "\txtype: 'datefield',\n");
    datefield = datefield.concat(_identation, "\tname: '", field.name, "',\n");
    datefield = datefield.concat(_identation, "\tfieldLabel: '", label, "',\n");
    datefield = datefield.concat(_identation, "\tlabelAlign: 'right',\n");
    datefield = datefield.concat(_identation, "\tlabelWidth: 120,\n");
    datefield = datefield.concat(_identation, "\tlabelStyle: 'font-weight:bold;font-size:10px!important;',\n");
    datefield = datefield.concat(_identation, "\temptyText: 'Ingresar...',\n");
    datefield = datefield.concat(_identation, "\tplugins: ['clearbutton'],\n");
    if(field.notnull && !isFilterForm){
        datefield = datefield.concat(_identation, "\tallowBlank: false,\n");
        datefield = datefield.concat(_identation, "\tafterLabelTextTpl: this.getRequiredStyle(),\n");
    }
    datefield = datefield.concat(_identation, "\tmargin: 10,\n");
    if(field.primarykey == 't')
        datefield = datefield.concat(_identation, "\thidden: true,\n");
    else    
        datefield = datefield.concat(_identation, "\thidden: ", field.hidden || false, ",\n");
    datefield = datefield.concat(_identation, "},\n");
    return datefield;
};

exports.convertToComboBox = function(field, identation, isFilterForm){
    var _this = this;
    var label = field.name.toUpperCase();
        label = label.replace(/_/gi, ' ');
    if(field.foreignkey)
        label = label.replace(/ID/gi, '');
    var _identation ="";
    for (var i = 0; i < identation; i++) {
        _identation += "\t";
    }
    var combobox = _identation.concat("{\n");
    combobox = combobox.concat(_identation, "\txtype: 'combobox',\n");
    combobox = combobox.concat(_identation, "\tname: '", field.name, "',\n");
    combobox = combobox.concat(_identation, "\tfieldLabel: '", label, "',\n");
    combobox = combobox.concat(_identation, "\tlabelAlign: 'right',\n");
    combobox = combobox.concat(_identation, "\tlabelWidth: 120,\n");
    combobox = combobox.concat(_identation, "\tlabelStyle: 'font-weight:bold;font-size:10px!important;',\n");
    combobox = combobox.concat(_identation, "\temptyText: 'Seleccionar...',\n");
    combobox = combobox.concat(_identation, "\tplugins: ['clearbutton'],\n");
    if(field.notnull && !isFilterForm){
        combobox = combobox.concat(_identation, "\tallowBlank: false,\n,");
        combobox = combobox.concat(_identation, "\tafterLabelTextTpl: this.getRequiredStyle(),\n");
    }
    combobox = combobox.concat(_identation, "\tmargin: 10,\n");
    if(field.foreignkey){
        combobox = combobox.concat(_identation, "\tstore: ", "_this.", _this.toCamelCase(field.foreignkey), "Store.load({params: {", field.params, "}}),\n");
        combobox = combobox.concat(_identation, "\tqueryMode: 'remote',\n");
        combobox = combobox.concat(_identation, "\tqueryParam: '", cfg.PARAMS.queryParam, "',\n");
        combobox = combobox.concat(_identation, "\tdisplayField: '", field.displayField, "',\n");
        combobox = combobox.concat(_identation, "\tvalueField: '", field.valueField, "',\n");
        combobox = combobox.concat(_identation, "\twidth: 400,\n");
        combobox = combobox.concat(_identation, "\ttpl: ['<tpl for =\".\">',\n");
        combobox = combobox.concat(_identation, "\t\t'<div class=\"x-boundlist-item\">',\n");
        field.fields.forEach(function(_field){
            combobox = combobox.concat(_identation, "\t\t\t'<strong>", _this.toCamelCase(_field.name, true), ": {", _field.name, "}</br>'\n");
        })
        combobox = combobox.concat(_identation,"\t\t'</tpl>'].join('')\n");
    } else {
        combobox = combobox.concat(_identation, "\tstore: ", "_this.", _this.toCamelCase(store), "Store.load({params: {", params, "}}),\n");
        combobox = combobox.concat(_identation, "\tqueryMode: 'local',\n");
        combobox = combobox.concat(_identation, "\tdisplayField: '", displayField, "',\n");
        combobox = combobox.concat(_identation, "\tvalueField: '", valueField, "',\n");
        combobox = combobox.concat(_identation, "\tforceSelection: true,\n");
    }
    combobox = combobox.concat(_identation, "},\n");
    return combobox;
}