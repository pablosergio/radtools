/**
 * @class Ext.ux.Exporter.ExcelFormatter
 * @extends Ext.ux.Exporter.Formatter
 * Specialised Format class for outputting .xls files
 */
Ext.define("Ext.ux.excelFormatter.ExcelFormatter", {
    extend: "Ext.ux.Formatter",
    uses: [
        "Ext.ux.excelFormatter.Cell",
        "Ext.ux.excelFormatter.Style",
        "Ext.ux.excelFormatter.Worksheet",
        "Ext.ux.excelFormatter.Workbook"
    ],
    contentType: 'data:application/vnd.ms-excel;base64,',
    extension: "xls",

    format: function(store, config) {
      var workbook = new Ext.ux.excelFormatter.Workbook(config);
      workbook.addWorksheet(store, config || {});
      return workbook.render();
    }
});