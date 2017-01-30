Ext.define('app.controller.carousel.CarouselController', {
    extend: "Deft.mvc.ViewController",
    requires: ["app.ux.Carousel"],
	control: {
  		view: {
      		boxready: "loadInitialData"
    	}
	},

	init: function() {
		return this.callParent(arguments);
    },

    loadInitialData: function(){
    	var _this = this;
        var store = Ext.create('app.store.carousel.CarouselStore');
        var carousel = Ext.createWidget('carousel', {
            xPos: this.getView().getSize().width/2,
            yPos: this.getView().getSize().height/4,
            FPS: 70,
            reflHeight: 56,
            height:'100%',
            width:'100%',
            reflGap:2,
            bringToFront:true,
            store:store,
            altBox:'imageNameLabel',
            autoRotate: 'no',       
            renderTo: 'carousel-div',
            listeners:{
                keydown:function(){
                }
            }
        });
    	
        carousel.checkImagesLoaded();
    }
});