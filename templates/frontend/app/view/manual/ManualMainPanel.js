/**
* Creado por Erika Ballesteros en 03/06/2016
* Observaciones: Se implementan las llamadas del panel principal del objeto
* Fecha Ult. modificacion:
*/
Ext.define( 'sglm.view.ManualMainPanel', {
   extend: 'Ext.panel.Panel',
   alias: 'widget.sglm-view-manual-main-panel',
   frame: true,
   autoScroll: true,
   title: 'Border Layout',
   iconCls: 'book',
   layout: 'border',
   width:'100%',
   height:'100%',
   html: '<iframe src="./manual/SGLABMED.html" frameborder="0" width=100% height="100%" scrolling="yes"></iframe>'
});


