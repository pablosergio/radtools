/**
 * Created by Vanessa on 2/1/2017.
 */
/**
 * Created by Sergio on 10/12/2016.
 */
var _  = require('lodash');

exports.getType = function(type){
    var _type = 'string';
    var _split = type.split("(");
    switch(_split[0]){
        case "integer":
            _type = "int";
            break;
        case "numeric":
            _type: "decimal";
            break;
        case "character varying":
            _type = "string";
            break;
        case "timestamp without time zone":
            _type = "date";
            break;
    }
    return _type;
}