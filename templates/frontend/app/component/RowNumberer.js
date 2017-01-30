/*

 */
Ext.define('app.component.RowNumberer', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.rownumberer',

    /**
     * @cfg {String} text
     * Any valid text or HTML fragment to display in the header cell for the row number column.
     */
    text: "&#160",

    /**
     * @cfg {Number} width
     * The default width in pixels of the row number column.
     */
    width: 23,

    /**
     * @cfg {Boolean} sortable
     * @hide
     */
    sortable: false,
    
    /**
     * @cfg {Boolean} [draggable=false]
     * False to disable drag-drop reordering of this column.
     */
    draggable: false,

    // Flag to Lockable to move instances of this column to the locked side.
    autoLock: true,

    // May not be moved from its preferred locked side when grid is enableLocking:true
    lockable: false,

    align: 'right',

    constructor : function(config){

        // Copy the prototype's default width setting into an instance property to provide
        // a default width which will not be overridden by AbstractContainer.applyDefaults use of Ext.applyIf
        this.width = this.width;

        this.callParent(arguments);
        if (this.rowspan) {
            this.renderer = Ext.Function.bind(this.renderer, this);
        }
    },

    // private
    resizable: false,
    hideable: false,
    menuDisabled: true,
    dataIndex: '',
    cls: Ext.baseCSSPrefix + 'row-numberer',
    rowspan: undefined,

    // private
    renderer: function(value, metaData, record, rowIdx, colIdx, store) {
        var rowspan = this.rowspan;
        if (rowspan) {
            metaData.tdAttr = 'rowspan="' + rowspan + '"';
        }

        metaData.tdCls = Ext.baseCSSPrefix + 'grid-cell-special';
        return rowIdx + 1;
    }
});
