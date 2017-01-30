/* Desarrollado por Pablo Sergio Alvarado G. */
/* Menu principal de la aplicacion */

Ext.define('app.controller.menu.MainMenuController', {
	extend: "Deft.mvc.ViewController",
    inject: [
        "menuService",
        "menuContext",
        "localStorageService"
    ],
    config: {
        menuService: null,
        menuContext: null,
        localStorageService: null
    },
    control: {
  		view: {
      		boxready: "loadInitialData",
    	},
        
	},

	init: function() {
    	return this.callParent(arguments);
    },

    loadInitialData: function(){
    	var _this = this;
        this.menuService.loadMenu().then({
            success: function(records){
                var logo =  Ext.widget('image', {
                    src: "resources/images/logo_sglabmed.png",
                    cls: "app-logo",
                    width: 120
                });
                var brand = Ext.widget('component', {
                    html: "<strong>app</strong>:Sistema de Admimistracion y Cobranza Expensas en Condominios",
                    border: false,
                    cls: "app-header",
                    height: 4
                });
                var tbfill = Ext.widget('tbfill');
                _this.crearMenu(_this.getView(), records);
                var tbseparator = Ext.widget('tbseparator');
                var token = _this.localStorageService.get('appToken');
                var jwtService = Ext.create('app.service.jwt.JwtService');
                var _username =  jwtService.decodeToken(token).username;    
                var username = Ext.widget('button', {
                    text: _username,
                    glyph: 0xf007
               });
               var logout = Ext.widget('button', {
                    itemId: 'btnLogout',
                    text: 'Salir',
                    glyph: 0xf08b,
                    handler: function(){
                        _this.getLocalStorageService().delete('appToken');
                        window.location.reload()
                    }
                });
               _this.getView().add(tbfill);
               _this.getView().add(username);
               _this.getView().add(tbseparator);
               _this.getView().add(logout);
            },
            failure: function(errorMessage){
                console.log(errorMessage);
            }
        }).always(function() {
      		console.log('cargar menu');
    	});
    	
    },

    loadMenuOption: function(menuOption){
        return this.getMenuContext().optionMenuOpened(menuOption);
	},

    crearMenu: function (tb, records) {
        var me = this;
        Ext.each(records, function (root) {
            if (root.raw && root.raw.menu) {
                var subMenu = Ext.create('Ext.menu.Menu');
                tb.add({
                    //id: root.id || root.get('id'),
                    text: root.text || root.get('text'),
                    iconCls: root.iconCls || root.get('iconCls'),
                    menu: subMenu,
                    className:root.className || root.get('className'),
                    alias: root.alias || root.get('alias'),
                    scope: me
                    
                });

                me.crearMenu(subMenu, root.raw.menu || root.menu);
            }
            else {
                tb.add({
                    //id: root.id || root.get('id'),
                    text: root.text || root.get('text'),
                    iconCls: root.iconCls || root.get('iconCls'),
                    menu: subMenu,
                    className: root.className || root.get('className'),
                    alias: root.alias || root.get('alias'),
                    scope: me,
                    listeners: {
                            'click': function(menu){
                                me.loadMenuOption(menu);
                            }
                    }
                });
            }
        });

        return tb;
    }
});