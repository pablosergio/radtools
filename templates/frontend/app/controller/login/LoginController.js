/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.controller.login.LoginController', {
	extend: "Deft.mvc.ViewController",
    inject: [
        "loginService",
        "notificationService",
        "jwtService",
        "localStorageService",
    ],
    config: {
        loginService: null,
        notificationService: null,
        jwtService: null,
        localStorageService: null,
    },
    control: {
	    loginButton: {
	        click: 'onButtonClickIngresar'
	    },
        passwordField: {
            keyup: "onKeyup"
        },
        usernameField: {
            keyup: "onKeyup"
        },
        loginForm: true,
    },

	init: function() {
    },

	onButtonClickIngresar: function(button, e, options){
		var _this = this;
		var credenciales = this.getLoginForm().getValues();
		_this.getLoginForm().getEl().mask('Verificando credenciales....')
        return this.loginService.login(credenciales).then({
            success: function(res){
                    _this.getLocalStorageService().set("appToken", res.token);
            	    button.up('window').close();
                    return window.location.reload();
                   //return Ext.widget('app-main');
            },
            failure: function(errorMessage){
                     return _this.getNotificationService().error("Error", errorMessage);
            }
        }).always(function() {
      		return _this.getLoginForm().getEl().unmask();
    	});
	},

    onKeyup: function (field, event, options) {
        _this = this;
        if (event.getCharCode() == event.ENTER) {
            _this.onButtonClickIngresar(_this.getLoginButton());
        }
    }
});