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