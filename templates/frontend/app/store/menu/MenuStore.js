Ext.define("app.store.menu.MenuStore", {
  extend: "Ext.data.ArrayStore",
  inject: ["localStorageService"],
  requires: ["app.model.menu.Opcion"],
  model: "app.model.menu.Opcion",
  autoLoad: false,
  proxy: {
    type: "memory"
  },
  /**
   Simulate loading the Probability objects
  */

  load: function(options) {
    var data = this.getMenuFromLocalStorage();
    this.loadData(data);
    return options.callback(this.data.items, {}, true);
  },

  getMenuFromLocalStorage: function(){
    var token = this.localStorageService.get('appToken');
    var jwtService = Ext.create('app.service.jwt.JwtService');
    var menu =  jwtService.decodeToken(token).menu;
    var menuPrincipal = this.construirMenu(menu);
    return menuPrincipal;
  },

  construirMenu: function(menu){
    var _this = this;
    var menuPrincipal = [];
    Ext.each(menu, function(record){
      var opcion = Ext.create('app.model.menu.Opcion', {
        text: record.opcion,
        iconCls: record.icono,
        className: record.href,
        alias: record.alias,
        menu: record.submenu ? _this.construirMenu(record.submenu) : null
      });
      menuPrincipal.push(opcion);
    });
    return menuPrincipal;
  }
});
