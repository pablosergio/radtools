// /* Desarrollado por Pablo Sergio Alvarado G. */
/**
* Application configuration class, including endpoint lookup and runtime setting for mock vs. live data access.
* Inject into stores or other objects to resolve endpoints for loading data.
*
*/

Ext.define("app.config.AppConfig", {
  statics: {
    MOCK_DATA_ENV: "MOCK_DATA_ENV",
    DEVELOPMENT_ENV: "DEVELOPMENT_ENV",
    PRE_PRODUCTION_ENV: "PRE_PRODUCTION_ENV",
    PRODUCTION_ENV: "PRODUCTION_ENV"
  },
  config: {
    environment: null,
    MOCK_DATA_ENV: {
      endpoints: {
      },
      defaults: {
        urlPrefix: "data/",
        urlSuffix: ".json",
        dataRoot: ""
      }
    },
    PRODUCTION_ENV: {
      endpoints: {
        login: {
          proxyId: "/login"
        }
      },
      defaults: {
        urlPrefix: "http://localhost:8083/api",
        /* Los nombres de los reportes se encuentran en el ServicioReporte */
        urlPrefixReporte: "http://localhost:8080",
        urlSuffix: "",
        dataRoot: ""
      }
    },
    DEVELOPMENT_ENV: {
      endpoints: {
        /* @add endpoints */
        login: {
          proxyId: "/login"
        },
        
      },
      defaults: {
        urlPrefix: "http://localhost:8083/api",
        /* Los nombres de los reportes se encuentran en el ServicioReporte */
        urlPrefixReporte: "http://localhost:8080",
        urlSuffix: "",
        dataRoot: ""
      }
    },

  }, 
  /**
  	* Configures the application, particularly the endpoints used for server requests.
  	* @param {Object} cfg A configuration object, usually pulled from a static property in an application-specific configuration class.
  	* @param {String} environment Determines whether live server calls or mock JSON data files should be used. Set to MOCK_DATA_ENV or PRODUCTION_ENV. If no environment is specified, defaults to PRODUCTION_ENV.
  */

  constructor: function(cfg) {
    if ((cfg != null ? cfg.environment : void 0) && (app.config.AppConfig[cfg.environment] != null)) {
      return this.setEnvironment(app.config.AppConfig[cfg.environment]);
    } else {
      return this.setEnvironment(app.config.AppConfig.PRODUCTION_ENV);
    }
  },
  /**
  	* Given an endpoint name, returns the URL and root JSON data element for that endpoint. If no endpoint can be found, attempt to use the default url prefix and suffix.
  	* @param {String} Endpoint name
  	* @return {Object} Object with keys defined for the endpoint ( typically 'url' and 'root')
  */

  getEndpoint: function(endpointName) {
    var defaults, endpoints, environmentConfig, result, _ref, _ref1;
    environmentConfig = this[this.getEnvironment()];
    endpoints = environmentConfig.endpoints;
    defaults = environmentConfig.defaults;
    if (endpoints != null ? endpoints[endpointName] : void 0) {
      var urlPrefix =  defaults.urlPrefix;
      switch(endpointName){
        case 'reporte':
          urlPrefix = defaults.urlPrefixReporte;
          break;
        default:
          urlPrefix = defaults.urlPrefix;
          break;
      }
      result = {
        url: urlPrefix + endpoints[endpointName].proxyId + defaults.urlSuffix
      }
    } else {
      result = {
        url: defaults.urlPrefix + endpointName + defaults.urlSuffix,
        root: defaults.dataRoot
      };
    }
    return result;
  }

});
