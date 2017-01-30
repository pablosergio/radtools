Ext.define('app.controller.menu.MenuController', {
	extend: "app.controller.abstract.AbstractController",
	control: {
  		view: {
      		boxready: "loadInitialData"
    	}
	},

	init: function() {
		return this.callParent(arguments);
    },

    loadInitialData: function(){
    	var _this = this;
    	this.menuService.loadMenu().then({
            success: function(records){
            	Ext.each(records, function(root){
        			var menu = Ext.create('app.view.menu.Item', {
        				title: root.get('text'),
        				iconCls: root.get('iconCls'),
        				listeners: {
        					'itemclick': function(menu, record, item, index, e, eOpts ){
        						_this.loadMenuOption(record);
        					}
        				}
        			});
        			var items = root.raw.items;
        			Ext.each(items, function(item){
        					menu.getRootNode().appendChild({
        						text: item.text,
        						leaf: true,
        						iconCls: item.iconCls,
        						id: item.id,
        						className: item.className
        					});
        			});
        			_this.getView().add(menu);
        		});
            },
            failure: function(errorMessage){
                console.log(errorMessage);
            }
        }).always(function() {
      		console.log('cargar treepanel');
    	});
    	
    },

    loadMenuOption: function(menuOption){
        return this.getMenuContext().optionMenuOpened(menuOption);
	}
});