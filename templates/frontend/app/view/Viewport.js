/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.view.Viewport', {
    extend: 'Ext.container.Viewport',
    xtype: 'app-main',
    requires:[
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'app.view.main.Header',
        'app.view.main.Footer',
        'app.view.main.MainPanel',
        'app.view.menu.Menu'
    ],

    layout: {
        type: 'border'
    },

  initComponent: function() {
    Ext.applyIf(this, {
        items: [
            {
                xtype: 'app-view-header',
                region: 'north'
            },
            {
                xtype: 'app-view-footer',
                region: 'south',
            },
            {
                region: 'center',
                xtype: 'app-view-mainPanel',
            }]
    });
    return this.callParent(arguments);
  }
});