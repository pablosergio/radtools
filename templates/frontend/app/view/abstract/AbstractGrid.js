/**
 * Created by palvarado on 12/12/2016.
 */

Ext.define('app.view.abstract.AbstractGrid', {
    extend: 'Ext.grid.Panel',
    requires: ["Ext.grid.column.Number", "Ext.grid.column.Date", "Ext.grid.column.Action", "Ext.ux.grid.Printer", "app.view.reports.ReportsPDF"],
    columnLines: true,
    viewConfig: {
        stripeRows: true,
        emptyText: "<div class='x-grid-empty-custom'>Todavia no existen registros</div>",
        deferEmptyText: false
    },
    initComponent: function () {
        var me = this;

        me.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1,
                pluginsId: 'cellplugin'
            })
        ];

        me.features = [
            Ext.create('Ext.ux.grid.FiltersFeature', {
                local: true
            })
        ];

        me.textAppliedFilter = Ext.widget('component', {
            html: "<span style=color:orange;>(Filtro Aplicado)</span>",
            itemId: 'textAppliedFilter',
            hidden: true
        });

        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                itemId: 'topToolbar',
                items: [
                    {
                        itemId: 'btnAddRecord',
                        text: 'Nuevo',
                        iconCls: 'add'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        itemId: 'btnFilterGrid',
                        text: 'Filtrar',
                        glyph: 0xf0b0,
                        //hidden: true
                    },
                    {
                        xtype: 'button',
                        itemId: 'btnClearFilter',
                        text: 'Quitar Filtros',
                        iconCls: 'filter_delete',
                        //hidden: true
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: me.textAppliedFilter
                    },
                    {
                        xtype: 'button',
                        itemId: 'btnTrackDataEdition',
                        text: 'Historico',
                        iconCls: 'clock',
                        hidden: true
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'tbseparator'
                    },
                    {
                        xtype: 'button',
                        itemId: 'exportPdf',
                        text: 'PDF',
                        iconCls: 'pdf-document',
                        handler: function () {
                            app.view.reports.ReportsPDF.export(me);
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'printGrid',
                        text: 'Imprimir',
                        iconCls: 'printer',
                        handler: function () {
                            Ext.ux.grid.Printer.printAutomatically = false;
                            Ext.ux.grid.Printer.print(me);
                        }
                    }
                ]
            }, {
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                store: this.store,
                displayInfo: true
            }
        ];

        me.columns = Ext.Array.merge([
            {
                xtype: "rownumberer",
                width: 30,
                text: 'NRO',
                sortable: false
            }
        ], me.columns, [
            /*{
                text: 'Usuario',
                width: 90,
                align: 'center',
                dataIndex: 'login_usr',
            },*/
            {
                xtype: 'datecolumn',
                text: 'Fecha Registro',
                width: 120,
                dataIndex: 'fechaRegistro',
                format: 'd-m-Y H:i',
                filter: true,
                align: 'center'
            },
            /*{
                text: 'Estado',
                width: 80,
                align: 'center',
                dataIndex: 'estado',
            },*/
            {
	            xtype: "actioncolumn",
	            itemId: "deleteActionColumn",
	            text: "Eliminar",
	            width: 50,
	            align: "center",
	            sortable: false,
	            items: [{
	              itemId: "recordDeleteButton",
	              icon: "resources/icons/delete.png",
	              tooltip: "Delete Scenario",
	              iconCls: "mousepointer .x-grid-center-icon"
	             }]
             }
        ]);

        me.callParent(arguments);
    },

});