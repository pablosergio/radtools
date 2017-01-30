/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define("app.view.main.MainPanel", {
extend: "Ext.tab.Panel",
  mixins: [ 'Deft.mixin.Controllable', 'Deft.mixin.Injectable' ],
  controller: "app.controller.main.MainPanelController",
  alias: "widget.app-view-mainPanel",
  initComponent: function() {
    Ext.applyIf(this, {
      header: false,
      plain: true
    });
    return this.callParent(arguments);
  }
});
