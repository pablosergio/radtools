/**
 * Created by Sergio on 11/12/2016.
 */

Ext.define("app.context.menu.MenuContext", {
    extend: "app.context.abstract.AbstractContext",
    /**
     * Constructor.
     */

    constructor: function(config) {
        if (config == null) {
            config = {};
        }
        this.callParent(arguments);
        return this.addEvents("initialDataLoaded", "optionMenuOpened");
    },
    /**
     * Notifies interested objects that initial data has been loaded.
     */

    initialDataLoaded: function() {
        /**
         * @event initialDataLoaded Initial data loaded.
         */
        return this.fireEvent("initialDataLoaded");
    },
    /**
     * Notified interested objects that a una option menu is being opened.
     */

    optionMenuOpened: function(option) {
        /**
         * @event optionOpened option menu opened.
         * @param {sglm.model.menu.Item}.
         */
        return this.fireEvent("optionMenuOpened", option);
    }
});

