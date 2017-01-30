/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.service.localStorage.LocalStorageService', {
        clear: function(){
            return localStorage.clear();
        },
        get: function(key){
            return JSON.parse(localStorage.getItem(key));
        },
        set: function(key, data){
            return localStorage.setItem(key, JSON.stringify(data));
        },
        getAllContains: function(contains){
            var data = [];
            var items = Object.keys(localStorage);
            for (var i = 0;  i < items.length; i++) {
                if (items[i].indexOf(contains) > -1) {
                    data.push(JSON.parse(localStorage[items[i]]));
                }
            }
            return data;
        },
        deleteAllContains: function(contains){
            var items = Object.keys(localStorage);
            for (var i = 0;  i < items.length; i++) {
                if (items[i].indexOf(contains) > -1) {
                    localStorage.removeItem(items[i]);
                }
            }
        },
        delete: function(key){
            return localStorage.removeItem(key);
        }

}); 