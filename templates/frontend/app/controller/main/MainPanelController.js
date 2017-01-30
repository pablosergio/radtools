/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('app.controller.main.MainPanelController', {
    extend: 'Deft.mvc.ViewController',
    inject: [
        'menuContext',
        'menuService'
    ],
    config: {
        menuContext: null,
        menuService: null
    },
    requires: [
        'app.view.carousel.CarouselPanel',
    ],
    observe: {
	    menuContext: {
	      optionMenuOpened: 'onOptionMenuOpened',
	    }
	  },
    control: {
	    view: {
	      boxready: 'loadInitialData'
	    }
    },
    init: function() {

        return this.callParent(arguments);
    },
	  /**
	  	* Loads the initial reference dta.
	  */
    loadInitialData: function() {
        var _this = this;
        return this.getView().add({
            xtype: 'view-carouselpanel',
            itemId: 'home',
            title: 'Inicio',
            glyph: 0xf015,
            closable: false,
        }).show();
    },
    /**
     * Responds when a {sglm.model.menu.Item} view is opened.
     * @param {sglm.model.menu.Item} OptionMenu being opened.
     */

    onOptionMenuOpened: function(menuOption){
        var existingMenuOptionPanel;
        existingMenuOptionPanel = this.findExistingTab(menuOption);
        if((existingMenuOptionPanel != null)){
            return existingMenuOptionPanel.show();
        }else{
            var panel = Ext.create(menuOption.className, {
                itemId: 'panel_' + menuOption.alias,
                title: menuOption.text,
                iconCls: menuOption.iconCls || 'application',
                closable: true,
            });

            return this.getView().add(panel).show();
        }
    },

    findExistingTab: function(menuOption) {
        return this.getView().child('#panel_' + menuOption.alias);
    }

});