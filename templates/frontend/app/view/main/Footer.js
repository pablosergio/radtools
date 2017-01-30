/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.view.Footer', {
  extend: "Ext.container.Container",
  alias: "widget.app-view-footer",
  height: 30,
  ui: 'footer',

  initComponent: function() {
    Ext.applyIf(this, {
      items: [
        {
          xtype: "label",
          html: '<div id="titleHeader"><center><span style="font-size:10px;">Copyright © 2016&nbsp;&nbsp;&nbsp; Sistemas para la Administracion y Cobranza Expensas en Condominios</span></center></div>'
        }
      ]
    });
    return this.callParent(arguments);
  }
})