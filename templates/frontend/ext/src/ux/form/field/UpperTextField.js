Ext.define('Ext.ux.form.field.UpperTextField', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.uppertextfield',

    init: function (cmp) {
        Ext.apply(cmp, {
            fieldStyle: (cmp.fieldStyle ? cmp.fieldStyle + ';' : '') + 'text-transform:uppercase',
            getValue: function() {
                var val = cmp.__proto__.getValue.apply(cmp, arguments);
                return val && val.toUpperCase ? val.toUpperCase() : val;
            }
        });
    }
});