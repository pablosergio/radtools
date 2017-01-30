/**
 * @class Ext.ux.Exporter.ExcelFormatter.Worksheet
 * @extends Object
 * Represents an Excel worksheet
 * @cfg {Ext.data.Store} store The store to use (required)
 */
Ext.define("Ext.ux.excelFormatter.Worksheet", {

    constructor: function (store, config) {
        config = config || {};

        this.store = store;

        Ext.applyIf(config, {
            hasTitle: true,
            hasHeadings: true,
            stripeRows: true,

            title: "Workbook",
            columns: store.fields == undefined ? {} : store.fields.items
        });

        Ext.apply(this, config);

        Ext.ux.excelFormatter.Worksheet.superclass.constructor.apply(this, arguments);
    },

    /**
     * @property dateFormatString
     * @type String
     * String used to format dates (defaults to "Y-m-d"). All other data types are left unmolested
     */
    dateFormatString: "Y-m-d",

    worksheetTpl: new Ext.XTemplate(
        '<ss:Worksheet ss:Name="{title}">',
        '<ss:Names>',
        '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'{title}\'!R1:R2" />',

        '</ss:Names>',
        '<ss:Table x:FullRows="1" x:FullColumns="1" ss:ExpandedColumnCount="{colCount}" ss:ExpandedRowCount="{rowCount}">',
        '{columns}',
        '<ss:Row ss:Height="38">',
        '<ss:Cell ss:StyleID="title" ss:MergeAcross="{colCount - 1}">',
        '<ss:Data xmlns:html="http://www.w3.org/TR/REC-html40" ss:Type="String">',
        '<html:B><html:U><html:Font html:Size="15">{title}',
        '</html:Font></html:U></html:B></ss:Data><ss:NamedCell ss:Name="Print_Titles" />',
        '</ss:Cell>',
        '</ss:Row>',
        '<ss:Row ss:AutoFitHeight="1">',
        '{header}',
        '</ss:Row>',
        '{rows}',
        '</ss:Table>',
        '<x:WorksheetOptions>',
        '<x:PageSetup>',
        '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />',
        '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />',
        '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />',
        '</x:PageSetup>',
        '<x:FitToPage />',
        '<x:Print>',
        '<x:PrintErrors>Blank</x:PrintErrors>',
        '<x:FitWidth>1</x:FitWidth>',
        '<x:FitHeight>32767</x:FitHeight>',
        '<x:ValidPrinterInfo />',
        '<x:VerticalResolution>600</x:VerticalResolution>',
        '</x:Print>',
        '<x:Selected />',
        '<x:DoNotDisplayGridlines />',
        '<x:ProtectObjects>False</x:ProtectObjects>',
        '<x:ProtectScenarios>False</x:ProtectScenarios>',
        '</x:WorksheetOptions>',
        '</ss:Worksheet>'
    ),

    /**
     * Builds the Worksheet XML
     * @param {Ext.data.Store} store The store to build from
     */
    render: function (store) {
        return this.worksheetTpl.apply({
            header: this.buildHeader(),
            columns: this.buildColumns().join(""),
            rows: this.buildRows().join(""),
            colCount: this.columns.length,
            rowCount: this.store.getCount() + 2,
            title: this.title
        });
    },

    buildColumns: function () {
        var cols = [];

        Ext.each(this.columns, function (column) {
            cols.push(this.buildColumn());
        }, this);

        return cols;
    },

    buildColumn: function (width) {
        return Ext.String.format('<ss:Column ss:AutoFitWidth="1" ss:Width="{0}" />', width || 164);
    },

    buildRows: function () {
        var rows = [];

        this.store.each(function (record, index) {
            rows.push(this.buildRow(record, index));
        }, this);

        return rows;
    },

    buildHeader: function () {
        var cells = [];
        //console.dir(this.columns);
        Ext.each(this.columns, function (col) {
            var title;
            // console.dir(col);
            if (col.dataIndex != "") {
                // alert(col.dataIndex);
                // console.log(col.text);
                if (col.text != undefined) {
                    //title = col.text;
                    title = col.text.replace(/<br>/g, " ");
                    title = title.replace("</br>", " ");
                    title = title.replace("</strong>", " ");
                    title = title.replace("<strong>", " ");
                    // console.dir(title);
                    //title = title.replace(/<b>/g, " ");
                    //title = title.replace(/<�||||b>/g, " ");
                    //</b>
                    //alert(title);
                }
                else if (col.name) {
                    //make columns taken from Record fields (e.g. with a col.name) human-readable
                    title = col.text.replace(/<br>/g, " ");
                    title = title.replace("</br>", " ");
                    title = title.replace("</strong>", " ");
                    title = title.replace("<strong>", " ");

                    title = Ext.String.capitalize(title);
                }
                cells.push(Ext.String.format('<ss:Cell ss:StyleID="headercell"><ss:Data ss:Type="String">{0}</ss:Data><ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>', title));
            }
            //else {
            //    console.dir(col);
            //}
        }, this);
        // console.dir(cells);
        return cells.join("");
    },

    buildRow: function (record, index) {

        var style,
            cells = [];
        if (this.stripeRows === true) style = index % 2 == 0 ? 'even' : 'odd';

        Ext.each(this.columns, function (col) {
            // console.dir(col);
            var name = col.name || col.dataIndex;
            if (name) {
                try {

                    //if given a renderer via a ColumnModel, use it and ensure data type is set to String
                    if (Ext.isFunction(col.renderer)) {
                        // console.dir(col);
                        // alert(record.get(name));
                        var value = col.renderer(record.get(name), new Object(true), record),
                            type = "String";
                        value = value.replace(/<strong>|<\/strong>/gi, "");
                        value = value.replace(/<br>|<\/br>/gi, " ");
                        value = Ext.String.htmlEncode(value)

                    } else {


                        var value = record.get(name),
                            type = this.typeMappings[col.type || record.fields.get(name).type.type];
                    }

                    cells.push(this.buildCell(value, type, style).render());
                }
                catch (mese) {
                    console.dir(mese);
                }
            }
        }, this);
        // console.dir(cells);
        return Ext.String.format("<ss:Row>{0}</ss:Row>", cells.join(""));

    },

    buildCell: function (value, type, style) {
        //alert(value);
        if (type == "DateTime" && Ext.isFunction(value.format)) value = value.format(this.dateFormatString);
        return new Ext.ux.excelFormatter.Cell({
            value: value.toString().search("<img") != -1 ? "" : value,
            type: type,
            style: style
        });

    },

    /**
     * @property typeMappings
     * @type Object
     * Mappings from Ext.data.Record types to Excel types
     */
    typeMappings: {
        'int': "Number",
        'string': "String",
        'float': "Number",
        'date': "DateTime"
    }
});