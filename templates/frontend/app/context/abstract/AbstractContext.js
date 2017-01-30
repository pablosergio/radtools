// /* Desarrollado por Pablo Sergio Alvarado G. */
/**
 * Abstract Context class. Acts as a base class for concrete Context objects to manage application state and
 * fire events which other objects can respond to.
 */

Ext.define("app.context.abstract.AbstractContext", {
    mixins: {
        observable: "Ext.util.Observable"
    },
    constructor: function (config) {
        if (config == null) {
            config = {};
        }
        this.mixins.observable.constructor.call(this);
        this.initConfig(config);
        return this.callParent(arguments);
    },

    initialDataLoaded: function () {
        /**
         * @event initialDataLoaded Initial data loaded.
         */
        return this.fireEvent("initialDataLoaded");
    }
});
