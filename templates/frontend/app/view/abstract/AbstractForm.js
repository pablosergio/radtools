/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define("app.view.abstract.AbstractForm", {
  extend: 'Ext.form.Panel',
  requires: ["Ext.ux.form.field.ClearButton", "Ext.ux.form.field.UpperTextField"],
  config: {
    requiredStyle: "<span class='ux-required-field' data-qtip='Required'>*</span>"
  },
  layout: "anchor",
  anchor: "100% 100%",
  bodyStyle: {
    background: '#F0F4F9',
    font: '12px Georgia, "Times New Roman", Times, serif',
    color: '#888',
    border:'1px solid #E4E4E4'
  },
  labelStyle: 'font-weight:bold;font-size:10px!important;',
  initComponent: function() {
    var _this = this;
    _this.btnGuardar = Ext.widget('button', {
        text: "Guardar",
        itemId: "saveButton",
        iconCls: "save-icon",
        formBind: true
    });

    _this.btnEditar = Ext.widget('button', {
        text: "Editar",
        itemId: "editButton",
        glyph: 0xf040,
        hidden: true,
    });

    _this.btnCopiar = Ext.widget('button', {
        text: "Copiar",
        itemId: "copyButton",
        iconCls: "copy-icon",
        formBind: true
    });

    _this.btnCancelar = Ext.widget('button', {
        text: "Cancelar",
        itemId: "cancelButton",
        iconCls: "cancel-icon",
        hidden: true,
    });

    Ext.apply(this, {
      fieldDefaults: {
        msgTarget: "side",
        readOnlyCls: 'DisabledClase',
        disabledCls: 'DisabledClase',
        plugins: ['clearbutton', 'uppertextfield'],
        labelAlign: "right"
      },
      tbar: [
        {
         xtype: _this.btnGuardar
        }, {
          xtype: _this.btnCopiar
        }, {
          xtype: 'tbseparator'
        }, {
          xtype: _this.btnEditar
        }, {
          xtype: _this.btnCancelar
        }
      ]
    });
    return this.callParent(arguments);
  },

  setReadOnlyAll: function (bReadOnly) {
      var me = this;
      Ext.suspendLayouts();
        me.getForm().getFields().each(function (field) {
          field.setDisabled(bReadOnly);
          if(field.plugins && bReadOnly){
            field.plugins[0].clearButtonEl.setStyle('visibility', 'hidden');
          }
          if(field.plugins && !bReadOnly){
            field.plugins[0].handleAfterRender(field);
          }
        });
        Ext.resumeLayouts();
    },

    setAllowBlankTodos: function (esObligatorio) {
      var me = this;
      Ext.suspendLayouts();
        me.getForm().getFields().each(function (field) {
          field.allowBlank = esObligatorio;

        });
        Ext.resumeLayouts();
    }

});
