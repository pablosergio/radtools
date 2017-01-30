Ext.define('app.view.carousel.CarouselPanel', {
    extend: "Ext.panel.Panel",
    mixins: ['Deft.mixin.Controllable', 'Deft.mixin.Injectable'],
    controller: 'app.controller.carousel.CarouselController',
    alias: 'widget.view-carouselpanel',
    layout:'border',
    header:false,
    border:false,
    width:'100%',
    height:'100%',
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
            items:[
                {
                    html:'<div class = "carousel-div" id="carousel-div" ></div>',
                    region:'center',
                    items:[]
                },
                {
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
    }
});

