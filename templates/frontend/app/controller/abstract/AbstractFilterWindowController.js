/* Desarrollado por Pablo Sergio Alvarado G. */
/* Abstract controller para Window Filter */

Ext.define("app.controller.abstract.AbstractFilterWindowController", {
    extend: "Deft.mvc.ViewController",
    control: {
        view: {
            boxready: "onBoxReady"
        },
        btnWindowFiltrar: {
            click: "onBtnWindowFiltrarClick"
        },

    },

    init: function () {
        return this.callParent(arguments);
    },

    onBoxReady: function () {
        var _this = this;
    },

    onBtnWindowFiltrarClick: function () {
        var _this = this;
        var parametros = _this.getView().down('form').getValues();
        parametros.page = 1;
        parametros.start = 0;
        _this.getView().grid.getStore().proxy.extraParams = parametros;
        _this.getView().grid.getStore().load({
            callback: function () {
                delete _this.getView().grid.getStore().getProxy().extraParams.page;
                delete _this.getView().grid.getStore().getProxy().extraParams.start;

                _this.getView().grid.getStore().loadPage(1);
                _this.getView().grid.textAppliedFilter.setVisible(true);
                _this.getView().close();
            }
        });
    }

});