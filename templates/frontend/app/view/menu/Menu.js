/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define("app.view.menu.MainMenu", {
  extend: "Ext.toolbar.Toolbar",
  controller: 'app.controller.menu.MainMenuController',
  alias: "widget.app-view-main-menu",
  initComponent: function() {
    var _this = this;
    Ext.apply(this, {
      docked: 'top',
    });
    return this.callParent(arguments);
  }
});
