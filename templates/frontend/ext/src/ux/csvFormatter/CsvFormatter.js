/**
 * @class Ext.ux.Exporter.CSVFormatter
 * @extends Ext.ux.Exporter.Formatter
 * Specialised Format class for outputting .csv files
 */
Ext.define("Ext.ux.csvFormatter.CsvFormatter", {
    extend: "Ext.ux.Formatter",
    contentType: 'data:text/csv;base64,',
    separator: ",",
    extension: "csv",

    format: function(store, config) {
        this.columns = config.columns || (store.fields ? store.fields.items : store.model.prototype.fields.items);
        return this.getHeaders() + "\n" + this.getRows(store);
    },
    getHeaders: function() {
        var columns = [], title;
        Ext.each(this.columns, function(col) {
          var title;
          if (col.text != undefined) {
            title = col.text;
          } else if(col.name) {
            title = col.name.replace(/_/g, " ");
            title = Ext.String.capitalize(title);
          }

          columns.push(title);
        }, this);

        return columns.join(this.separator);
    },
    getRows: function(store) {
        var rows = [];
        store.each(function(record, index) {
          rows.push(this.geCell(record, index));
        }, this);

        return rows.join("\n");
    },
    geCell: function(record) {
        var cells = [];
        Ext.each(this.columns, function(col) {
            var name = col.name || col.dataIndex;
            if(name) {
                var value;
                if (Ext.isFunction(col.renderer)) {
                  value = col.renderer(record.get(name), null, record);
                } else {
                  value = record.get(name);
                }
                cells.push(value);
            }
        });

        return cells.join(this.separator);
    }
});