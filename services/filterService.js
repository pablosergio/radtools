/**
 * Created by Sergio on 10/12/2016.
 */
var _  = require('lodash');

/*function FilterSet(filters) {
    if (!(this instanceof FilterSet)) {
        return new FilterSet(filters);
    }
    if (!filters || typeof filters !== 'object') {
        throw new TypeError("Parameter 'filters' must be an object.");
    }
    this._rawDBType = true;
    this.formatDBType = function () {
        var keys = Object.keys(filters);
        var s = keys.map(function (k) {
            return pgp.as.name(k) + ' = ${' + k + '}';
        }).join(' AND ');
        return pgp.as.format(s, filters);
    };
}*/

/*var filter = new FilterSet({
    first: 1,
    second: 'two'
});

var test = pgp.as.format("WHERE $1", filter);*/

exports.removeKeysNull = function(object){
  for (var propName in object) { 
    if (object[propName] == null || object[propName] == undefined || object[propName] == '') {
      delete object[propName];
    }
  }
  return _.omit(object, '_dc','page', 'start', 'limit', 'sort', 'dir');
    
}