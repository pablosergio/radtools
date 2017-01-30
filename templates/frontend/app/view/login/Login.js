/* Desarrollado por Pablo Sergio Alvarado G. */

Ext.define("app.view.login.Login", {
	extend: 'Ext.window.Window',
 	mixins: [ 'Deft.mixin.Controllable', 'Deft.mixin.Injectable' ],
    controller: 'app.controller.login.LoginController',
    alias: 'widget.login',
    id: 'loginWindow',
    autoShow: true,
    height: 170,
    width: 360,
    layout: {
    	type: 'fit'
    },
    bodyStyle: {
        background: '#F0F4F9',
        font: '12px Georgia, "Times New Roman", Times, serif',
        color: '#888',
        border:'1px solid #E4E4E4'
    },
    labelStyle: 'font-weight:bold;font-size:10px!important;',
    glyph:0xf023,
    title: 'Sistema de Administracion y Cobranza Expensas',
    closeAction: 'hide',
    closable: false,
    config: {
        requiredStyle: "<span class='ux-required-field' data-qtip='Required'>*</span>"
    },
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
            items: [
        	    {
            		xtype: 'form',
            		id: 'loginForm',
                    frame: false,
            		bodyPadding: 15,
                    bodyStyle: {
                        background: '#F0F4F9',
                        font: '12px Georgia, "Times New Roman", Times, serif',
                        color: '#888',
                        border:'1px solid #E4E4E4'
                    },
                    defaults: {
            			xtype: 'textfield',
            			anchor: '100%',
            			allowBlank: false,
                        msgTarget: 'under',
                        minLength: 3,
                        blankText: 'Este campo es obligatorio',
                        minLengthText: 'El tamaño minimo de este campo es de 3 carcteres',
                        labelAlign: "right"
            		},
            		items: [
        	    		{
        					name: 'username',
        	    			fieldLabel: 'Usuario',
                            labelAlign: 'right',
                            labelStyle: 'font-weight:bold;font-size:11px!important;',
                            itemId: 'usernameField',
                            enableKeyEvents: true,
                            
        	    		},
        	    		{
        					inputType: 'password',
        					name: 'password',
        	    			itemId: 'passwordField',
                            fieldLabel: 'Contraseña',
                            labelAlign: 'right',
                            labelStyle: 'font-weight:bold;font-size:11px!important;',
                            enableKeyEvents: true,
                            
        	    		},
                        {
                            name: 'codigoApp',
                            fieldLabel: 'Codigo',
                            value: 'app',
                            hidden: true
                        },
            		],
        		}],
                dockedItems: [
                        {
                            xtype: 'toolbar',
                            dock: 'bottom',
                            items: [
                                {
                                    xtype: 'tbfill',
                                },
                                {
                                    xtype: 'button',
                                    id: 'loginButton',
                                    text: 'Ingresar',
                                    glyph: 0xf084,
                                    formBind: true
                                }
                            ]
                        }
                ]
        });
        me.callParent( arguments );
    }
   
});