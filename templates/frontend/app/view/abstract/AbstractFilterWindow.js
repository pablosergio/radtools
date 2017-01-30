Ext.define('app.view.abstract.AbstractFilterWindow', {
	extend: 'Ext.window.Window',
	controller: 'app.controller.abstract.AbstractFilterWindowController',
	alias: 'widget.app-abstract-filter-window',
	modal: true,
	iconCls: 'application_form_magnify',
	closable: false,
	initComponent: function(){
		var me = this;
		Ext.apply(this, {
			buttons: [
				{
					text: 'Filtrar',
					itemId: 'btnWindowFiltrar',
					glyph: 0xf0b0
				},
				{
					text: 'Cerrar',
					glyph: 0xf00d,
					handler: function(){
						this.up('window').close()
					}
				}
			]
		});
		me.callParent(arguments);
	},

	filtrarConValoresFormulario: function(form, callback){
		var params = form.getValues();
		callback(params);
	},

	onEscucharTeclaEnter: function(){
		var btnFiltrar = Ext.ComponentQuery.query('#btnWindowFiltrar')[0];
		if(btnFiltrar) 
			btnFiltrar.fireEvent('click', btnFiltrar);
	}
});