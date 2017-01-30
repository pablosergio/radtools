Ext.define('app.model.menu.Opcion', {
	extend: 'Ext.data.Model',
	fields: [
		{ name: 'text' },
		{ name: 'iconCls' },
		{ name: 'className' },
		{ name: 'id' },
		{ name: 'menu'},
		{ name: 'alias'}

	],
	hasMany: {
		model: 'app.model.menu.Opcion',
		name: 'menu',
	}
});