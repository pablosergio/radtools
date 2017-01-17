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
           field.size = getSize(type);
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