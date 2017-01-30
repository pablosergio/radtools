/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.service.login.LoginService', {
        requires: [ 'Ext.Ajax'], 
        inject: ["appConfig"],
        config: {
            appConfig: null
        },
        constructor: function(config) {
                if (config == null) {
                   config = {};
                }
                this.initConfig(config);
                return this.callParent(arguments);
        },
        login: function ( credenciales ) { 
                var deferred = Ext.create( 'Deft.promise.Deferred' ); 
                Ext.Ajax.request({
                        url: this.getAppConfig().getEndpoint("login").url,
                        params: credenciales,
                        method: 'POST',
                        success: function ( response, options ) {
                                var res = Ext.JSON.decode( response.responseText );
                                if (res.success) {
                                        var res =   Ext.JSON.decode( response.responseText );
                                        deferred.resolve(res); 
                                } 
                                else { 
                                        deferred.reject(res.msg); 
                                } 
                        }, 
                        failure: function ( response, options ) {
                                deferred.reject(response.responseText);
                        } 
                }); 
                 
                return deferred.promise; 
        } 
         
}); 