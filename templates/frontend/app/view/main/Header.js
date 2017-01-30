/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.view.Header', {
  extend: "Ext.panel.Panel",
  alias: "widget.app-view-header",
  requires: ["app.view.menu.Menu"],
  ui: 'footer',
  initComponent: function() {
    Ext.applyIf(this, {
      dockedItems: [{
        xtype: 'app-view-main-menu'
      }]
    });
    return this.callParent(arguments);
  }
});