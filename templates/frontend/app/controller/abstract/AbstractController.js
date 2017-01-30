// /* Desarrollado por Pablo Sergio Alvarado G. */
/**
* Abstract ViewController for the app application.
*/

Ext.define("app.controller.abstract.AbstractController", {
  extend: "Deft.mvc.ViewController",
  inject: [
    'notificationService',
    'jwtService',
    'localStorageService',
    'abstractContext',
  ],
  config: {
    notificationService: null,
    jwtService: null,
    localStorageService: null,
    abstractContext: null
  },
  init: function() {
    return this.callParent(arguments);
  }
});
