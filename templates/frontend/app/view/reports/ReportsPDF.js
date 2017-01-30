/* Desarrollado por Ubaldo villazon */

Ext.define('sacec.view.reports.ReportsPDF', {
    alias: "widget.sacec-reportsPDF",
    statics: {
        export: function (grid) {
            // console.dir(grid);
            var me = this;
            var columns = [];
            var titleCabecera = grid.title;
            var columnsNotHidden = Ext.Array.filter(grid.columns, function (col) {
                return !col.hidden && (!col.xtype || col.xtype != "actioncolumn");
            });
            Ext.each(columnsNotHidden, function (c) {
                if (c.items && c.items.length > 0) {
                    columns = columns.concat(c.items.items);
                } else {
                    columns.push(c);
                }
            });
            var headers = [];
            var dataIndex = [];
            var i = 0;

            Ext.each(columns, function (c) {
                if (c.text != "") {
                    title = c.text.replace('</br>', " ");
                    title = Ext.String.capitalize(title);

                    headers.push(title);
                    dataIndex.push(c.dataIndex);
                    i++;
                }

            });

            // console.dir(dataIndex);
            // Ext.Object.each(dataIndex, function (key, value) {
            //     console.log(key + "=>" + value);
            // });
            var i = 1;
            var rows3 = [];
            rows3.push(headers);
            grid.store.each(function (record) {
                var row = [];
                Ext.each(columns, function (col) {
                    var name = col.name || col.dataIndex;
                    if (col.xtype === 'rownumberer') {
                        value = i.toString();
                    }
                    else if (Ext.isFunction(col.renderer)) {
                        // console.dir(col);
                        // alert(record.get(name));
                        var value = col.renderer(record.get(name), new Object(true), record),
                            type = "String";
                        // console.log(value);
                        value = value.replace(/<strong>|<\/strong>/gi, "");
                        value = value.replace(/<br>|<\/br>/gi, " ");
                        value = value === null ? "" : Ext.String.htmlEncode(value)

                    } else {

                        var value = record.get(name),
                            type = record.fields.get(name).type.type;
                    }

                    row.push(value);
                });
                console.dir(row);

                // console.dir(records);
                // Ext.Object.each(dataIndex, function (key, value) {
                //     // console.log(key + "=>" + value);
                //     if (!Ext.isEmpty(value)) {
                //         console.log(records.get(value));
                //         try {
                //             var str = Ext.Date.format(records.get(value), 'Y-m-d');
                //             if (str === "") {
                //                 row.push(records.get(value));
                //             }
                //             else {
                //                 row.push(str);
                //             }
                //         } catch (ea) {
                //             console.log(ea);
                //             row.push(records.get(value));
                //         }
                //     }
                //     else {
                //         row.push(i);
                //     }
                // });
                rows3.push(row);
                i++;
            });
            // console.log(rows3);


            var docDefinition = {
                pageOrientation: 'landscape',
                pageMargins: [10, 10, 10, 10],
                info: {
                    title: titleCabecera,
                    author: 'ELFEC SA.',
                    subject: titleCabecera,
                    keywords: titleCabecera,
                },
                content: [
                    {
                        text: titleCabecera,
                        style: 'header',
                        alignment: 'center'
                    },
                    {
                        style: 'tableExample',
                        table: {
                            //  widths: [100, 100, 100, 100, 100, 100],
                            body: rows3
                        }
                    }],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 0, 0, 0],
                        fontSize: 7,
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 8,
                        color: 'black'
                    }
                },
            };

            pdfMake.createPdf(docDefinition).open();
        },
        mostrar: function () {
            console.log("hola");
        }
    }


})
;