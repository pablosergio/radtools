Ext.define('sacec.view.carousel.CarouselWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.carouselwindow',

    width:'80%',
    height:'80%',
    layout:'border',
    header:false,
    border:false,
    closeAction:'destroy',

    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            listeners:{
                close:function(){
                    var images = Ext.query('.carousel-image');
                    for(var m = 0; m<images.length; m++){
                        console.log(images[m]);
                        images[m].remove();
                    }

                    var reflection = Ext.query('.reflection');
                    for(var m = 0; m<reflection.length; m++){
                        console.log(reflection[m]);
                        reflection[m].remove();
                    }

                    var carousel = Ext.query('.carousel-div');
                    for(var m = 0; m<carousel.length; m++){
                        console.log(carousel[m]);
                        carousel[m].remove();
                    }
                    console.log(Ext.query('.carousel-image'));
                    console.log(Ext.query('.carousel-div'));
                    console.log(Ext.query('.reflection'));
                }
            },
            /*dockedItems:[
                {
                    xtype:'toolbar',
                    dock:'top',
                    style:{"background-color":"black"},
                    items:[
                        {
                            xtype:'button',
                            text:'Inicio',
                            handler:function(self){
                                Ext.ComponentQuery.query('carousel')[0].goToFirst();
                            }
                        },'->',{
                            xtype:'datefield',
                            listeners:{
                                change:function(self){
                                    var carousel = Ext.ComponentQuery.query('carousel')[0];
                                    var matchIndex = carousel.store.find('dt_date',Ext.Date.format(self.value,'Y-m-d'));
                                    if(matchIndex != -1){
                                        carousel.goToIndex(matchIndex);
                                    }
                                    
                                }
                            }
//                        },'->',{
//                            xtype:'button',
//                            text:'Fin',
//                            handler:function(self){
//                                Ext.ComponentQuery.query('carousel')[0].goToLast();
//                            }
                        }
                    ]
                }
            ],*/
            items:[
                {
                    html:'<div class = "carousel-div" id="carousel-div" ></div>',
                    region:'center',
                    items:[]
                },{
                    region:'south',
                    bodyStyle:{"background-color":"black"},
                    height:50,
                    layout:{
                        type:'hbox',
                        columns:1
                    },
                    items:[
                        {
                            xtype:'label',
                            text:'**Name**',
                            name:'imageNameLabel',
                            width:'100%',
                            padding:'13 0 13 0',
                            style:{
                                color:'white',
                                'font-weight':'bold',
                                'font-size':'25px',
                                textAlign:'center'
                            }

                        }
                    ]
                }
            ]
            });
            
        me.callParent(arguments);
        
        
    },
    

});

