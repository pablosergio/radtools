/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define("app.service.menu.MenuService", {
  inject: ["menuStore"],
  config: {
    menuStore: null
  },
  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    this.initConfig(config);
    return this.callParent(arguments);
  },
  
  loadInitialData: function() {
    //return Deft.Chain.parallel([this.loadProbabilities, this.loadRevenueImpacts, this.loadAffectedItems], this);
  },
  
  loadMenu: function() {
    var deferred;
    deferred = Ext.create("Deft.promise.Deferred");
    this.getMenuStore().load({
      callback: function(records, operation, success) {
        if (success) {
          return deferred.resolve(records);
        } else {
          return deferred.reject("Error loading Menu");
        }
      },
      scope: this
    });
    return deferred.promise;
  }
  
});
 