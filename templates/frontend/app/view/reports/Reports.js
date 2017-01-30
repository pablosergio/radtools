/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define('sacec.view.reports.Reports', {
    alias: "widget.sacec-reports",
    extend: "Ext.ux.panel.PDF",
    width: '100%',
    height: '100%',
    /**
     * la escala en la que se muestra el reporte
     * valor por defecto 75%
     */
    pageScale: 1.25,
    /**
     * titulo del panel
     */
    title: 'PDF',
    content: null,
    /**
     * ruta del reporte
     */
    ruta: null,
    /**
     * parametros a enviar
     * parametros [
     *  param1  : valor_param
     *  n valores
     * ]
     */
    parametros: {},
    inject: [
      "appConfig", 
      "localStorageService", 
      "notificationService"
    ],
    server: 'jasperserver',
    rest: 'rest_v2/reports',
    routeReport: '/reports/sacec/',
    src: null,
    onlyPrint: false,
    grids: [],
    params: {
        j_username: 'jasperadmin',
        j_password: 'jasperadmin',
        ignorePagination: false
    },
    config: {
        notificationService: null
    },
    mostrarBotonCerrar : false,
    fnCerrar : null,
    /**
     * object {
     * params : {} => object
     * ruta : "" string ruta del backend
     * method : "" => string POST GET PUT DELETE
     *
     * }
     * para el caso de beforePrint la respuesta success = true le permitira imprimir success = false no le permitira imprimir le mostrara elmensaje de error
     */
    beforePrint: {},
    /**
     * object {
     * params : {} => object
     * ruta : "" string ruta del backend
     * method : "" => string POST GET PUT DELETE
     *
     * }
     * para el caso de afterPrint la respuesta success = true le permitira imprimir success = false no le permitira imprimir le mostrara elmensaje de error
     */
    afterPrint: {},
    initComponent: function () {
        var me = this;
        me.src = me.generarUrl('pdf');
        me.tbar = me.getBotones();
        me.getLimitSize();
        me.callParent(arguments);

    },
    show: function () {
        var me = this;
        me.content = Ext.widget("window", {
            maxWidth: me.MAXANCHO,
            maxHeight: me.MAXALTO,
            mostrarBotonCerrar : me.mostrarBotonCerrar,
            fnCerrar : me.fnCerrar,
            items: [
                me
            ]
        });
        me.content.show();
    },
    getLimitSize: function () {
        this.MAXANCHO = document.documentElement.clientWidth - 40;
        this.MAXALTO = document.documentElement.clientHeight - 70;
    },
    getBotones: function () {
        var me = this;
        me.btn_print = Ext.create("Ext.Button", {
            text: 'Imprimir',
            maxWidth: 65,
            iconCls: 'printer',
            scope: this,
            handler: me.onPrint

        });
        me.btn_pdf = Ext.create("Ext.Button", {
            text: 'PDF',
            download: 'pdf',
            maxWidth: 65,
            hidden: me.onlyPrint,
            iconCls: 'pdf-document',
            scope: this,
            handler: me.onDownload
        });
        me.btn_excel2003 = Ext.create("Ext.Button", {
            text: 'XLS03',
            maxWidth: 65,
            hidden: me.onlyPrint,
            iconCls: 'excel-icon',
            scope: this,
            download: 'xls',
            handler: me.onDownload
        });
        me.btn_excel2007 = Ext.create("Ext.Button", {
            text: 'XLS07',
            maxWidth: 65,
            hidden: me.onlyPrint,
            iconCls: 'excel-icon',
            scope: this,
            download: 'xlsx',
            handler: me.onDownload
        });
        me.btn_word2007 = Ext.create("Ext.Button", {
            text: 'Word07',
            maxWidth: 65,
            hidden: me.onlyPrint,
            iconCls: 'word-icon',
            scope: this,
            download: 'docx',
            handler: me.onDownload
        });
        me.btn_rtf = Ext.create("Ext.Button", {
            text: 'RTF',
            maxWidth: 65,
            hidden: me.onlyPrint,
            iconCls: 'word-icon',
            scope: this,
            download: 'rtf',
            handler: me.onDownload
        });

        return [me.btn_print, me.btn_pdf, me.btn_excel2003, me.btn_excel2007, me.btn_word2007, me.btn_rtf];
    },
    onDownload: function (btn) {
        var me = this;
        window.open(me.generarUrl(btn.download));
        window.close();
    },
    cargarWindows: function () {

    },
    getPanel: function () {
        var me = this;
        me.form = Ext.create("Ext.ux.panel.PDF", {
            title: me.title,
            width: me.width,
            height: me.height,
            pageScale: me.pageScale,                                           // Initial scaling of the PDF. 1 = 100%
            src: me.src
        });
        return me.form;
    },
    generarUrl: function (tipo) {
        var me = this;
        var url = me.appConfig.getEndpoint("reporte").url;
        var environmentConfig = me.appConfig[me.appConfig.getEnvironment()];
        var host = environmentConfig.defaults.urlPrefixReporte;
        var ruta = host + '/' + me.server + '/' + me.rest + '' + me.routeReport + '' + me.ruta + '.' + tipo + '?';
        var objs = Ext.apply({}, me.parametros, me.params);
        var argumentos = "";
        Ext.Object.each(objs, function (key, value, myself) {
            argumentos = (argumentos === "") ? key + '=' + value : argumentos + '&' + key + '=' + value;
        });

        return ruta + '' + argumentos;
    },
    onPrint: function () {
        var me = this;
        if (Ext.Object.isEmpty(me.beforePrint)) {
            me.print();
        }
        else {
            me.setLoading(true);
            return me.getCommonService().getRequest(me.beforePrint.ruta, me.beforePrint.method, me.beforePrint.params).then({
                success: function (res) {
                    me.print();
                },
                failure: function (errorMessage) {
                    return me.getNotificationService().error("Error", errorMessage);
                }
            }).always(function () {
                return me.setLoading(false);
            });

        }

    },
    print: function () {
        var me = this;
        var w = window.open("viewer/viewer.html?file=" + me.src);
        w.onafterprint = function(){
            me.onAfterPrint();

        }
        w.onload = function (a) {
            w.addEventListener('textlayerrendered', function (e) {
                if (e.detail.pageNumber === w.PDFViewerApplication.page) {
                    setTimeout(function () {
                        w.print();
                        var ival = setInterval(function () {
                            w.close();
                            clearInterval(ival);
                        }, 200);
                    }, 500);
                }
            }, true);

        };

    },
    onAfterPrint: function () {
        var me = this;
        if (!Ext.Object.isEmpty(me.afterPrint)) {
            me.setLoading(true);
            return me.getCommonService().getRequest(me.afterPrint.ruta, me.afterPrint.method, me.afterPrint.params).then({
                success: function (res) {
                    return me.getNotificationService().success("Exito", res.msg);
                },
                failure: function (errorMessage) {
                    return me.getNotificationService().error("Error", errorMessage);
                }
            }).always(function () {
                return me.setLoading(false);
            });

        }
    }
});