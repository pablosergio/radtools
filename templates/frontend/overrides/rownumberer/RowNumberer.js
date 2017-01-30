// Row numberer correct increasing
Ext.override(Ext.grid.RowNumberer, {
    renderer: function(v, p, record, rowIndex) {
        if (this.rowspan) {
            p.cellAttr = 'rowspan="'+this.rowspan+'"';
        }
        var st = record.store;

        if (st.lastOptions != undefined && st.lastOptions.page != undefined && st.lastOptions.start != undefined && st.lastOptions.limit != undefined) {
            var page = st.lastOptions.page - 1;
            var limit = st.lastOptions.limit;
            return limit*page + rowIndex+1;
        } else {
            return rowIndex+1;
        }
    }
});