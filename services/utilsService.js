/**
 * Created by Vanessa on 2/1/2017.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var _  = require('lodash');

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
        _fieldset = _fieldset.concat(_identation, "\t\t\t{ xtype: _this.".concat(_this.toCamelCase(fieldset.name), "}\n"));            
        _fieldset = _fieldset.concat(_identation, "\t\t]\n");
        _fieldset = _fieldset.concat(_identation, "\t},\n");
    
    return _fieldset;    
};

exports.convertToForm = function(columns, fields, title, icon, identation){
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
    form = form.concat(_identation,"\t]\n");
    form = form.concat(_identation,"});\n");
    return form;
}