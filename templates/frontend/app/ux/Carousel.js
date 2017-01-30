Ext.define('app.ux.Carousel', {
    extend: 'Ext.container.Container',
    alias: 'widget.carousel', // this component will have an xtype of 'carousel'
    name:'carousel',
	/**
	 * @cfg {Number} reflHeight
	 * Height of the auto-reflection in pixels, assuming applied to the item at the front. The reflection will scale automatically.
	 * A value of 0 means that no auto-reflection will appear.
	 * `0` is the default value.
	 */
	reflHeight:0,

	/**
	 * @cfg {Number} reflOpacity
	 * Specifies how transparent the reflection is. 0 is invisible, 1 is totally opaque.
	 * `0.5` is the default value.
	 */
	reflOpacity:0.5,

	/**
	 * @cfg {Number} reflGap
	 * Amount of vertical space in pixels between image and reflection, assuming applied to the item at the front.
	 * Gap will scale automatically.
	 * `0` is the default value.
	 */
	reflGap:0,

	/**
	 * @cfg {Number} minScale
	 * The minimum scale appled to the furthest item. The item at the front has a scale of 1. 
	 * To make items in the distance one quarter of the size, minScale would be 0.25.
	 * `0.5` is the default value.
	 */
	minScale:0.5,

	/**
	 * @cfg {Number} xPos
	 * Horizontal position of the circle centre relative to the container. You would normally set this to half the width of the container.
	 * `0` is the default value.
	 */
	xPos:0,

	/**
	 * @cfg {Number} yPos
	 * Vertical position of the circle centre relative to the container. You would normally set this to around half the height of container.
	 * `0` is the default value.
	 */
	yPos:0,

	/**
	 * @cfg {Number} xRadius
	 * Half-width of the circle that items travel around.
	 * `0` is the default value. Width of container / 2.3.
	 */
	xRadius:0,

	/**
	 * @cfg {Number} yRadius
	 * Half-height of the circle that items travel around. By playing around with this value, you can alter the amount of 'tilt'.
	 * `0` is the default value. Height of container / 6.
	 */
	yRadius:0,

	/**
	 * @cfg {String} altBox
	 * The id of the element that will display an image's alt attribute when hovered over. This element does not have to be within the container.
	 * `` is the default value.
	 */
	altBox: '',

	/**
	 * @cfg {String} titleBox
	 * The id of the element that will display an image's title attribute when hovered over. This element does not have to be within the container.
	 * `` is the default value.
	 */
	titleBox: '',

	/**
	 * @cfg {Number} FPS
	 * This is the approximate frame rate of the carousel in frames per second.
	 * The higher the number, the faster and smoother the carousel movement will appear. 
	 * However, frame rates that are too high can make the user's browser feel sluggish, especially if they have an under powered machine. 
	 * The default setting of 30 is a good tradeoff between speed and performance.
	 * `30` is the default value.
	 */
	FPS: 30,

	/**
	 * @cfg {String} autoRotate
	 * Turn on auto-rotation of the carousel using either 'left' or 'right' as the value. The carousel will rotate between items automatically. 
	 * The auto-rotation stops when the user hovers over the carousel area, and starts again when the mouse is moved off.
	 * `no` is the default value.
	 */
	autoRotate: 'no',

	/**
	 * @cfg {Number} yRadius
	 * Delay in milliseconds between each rotation in auto-rotate mode. A minimum value of 1000 (i.e. one second) is recommended.
	 * `1500` is the default value.
	 */
	autoRotateDelay: 1500,

	/**
	 * @cfg {Number} speed
	 * This value represents the speed at which the carousel rotates between items. Good values are around 0.1 ~ 0.3.
	 * A value of one will instantly move from one item to the next without any rotation animation. Values should be greater than zero and less than one.
	 * `0.2` is the default value.
	 */
	speed:0.2,

	/**
	 * @cfg {Boolean} mouseWheel
	 * If set to true, this will enable mouse wheel support for the carousel.
	 * `false` is the default value.
	 */
	mouseWheel: false,

	/**
	 * @cfg {Boolean} bringToFront
	 * If true, moves the item clicked on to the front.
	 * `false` is the default value.
	 */
	bringToFront: false,
	
	/**
	 * @cfg {Ext.data.Store} store
	 * The store to load the images to show in the carousel.
	 * `null` is the default value.
	 */
	store: null,
	controlTimer: 0,
	stopped: false,
	container: null,
	showFrontTextTimer: 0,
	autoRotateTimer: 0,
	xCentre: 0,
	yCentre: 0,
	frontIndex: 0,
	rotation: 0,
	destRotation: 0,
	timeDelay: 0,
	items: [],
    enableKeyEvents:true,
	images: null,
	innerWrapper: null,
		
   initComponent: function(config) {
   	//this.callParent(arguments);
 	this.container = this.renderTo ? Ext.get(this.renderTo) : this.up('container');
	if (this.xRadius === 0){
		this.xRadius = (this.container.getWidth()/2.3);
	}
	if (this.yRadius === 0){
		this.yRadius = (this.container.getHeight()/6);
	}
	this.xCentre = this.xPos;
	this.yCentre = this.yPos;

	// Start with the first item at the front.
	this.rotation = this.destRotation = Math.PI/2;
	this.timeDelay = 1000/this.FPS;
	
	// Turn on the infoBox
	if(this.altBox !== '')
//		Ext.get(this.altBox).applyStyles({display: 'block'});	
	if(this.titleBox !== '')
		Ext.get(this.titleBox).applyStyles({display: 'block'});	
//	
	// Turn on relative position for container to allow absolutely positioned elements
	// within it to work.
	this.container.applyStyles({ position:'relative', overflow:'hidden'});
	
	// Setup the store.
	this.initStore();
//	
//	// Setup the buttons.
////	this.setUpButtons();
//	
//	// TODO:  to implement the mousewheel event.
//	if (this.mouseWheel)
//	{
//
//	}
	
	this.setUpContainerListener();
        
	this.innerWrapper = this.container.createChild({
		tag: 'div',
		style: 'position:absolute;width:100%;height:100%;'
	});

	//this.checkImagesLoaded();
	this.callParent(arguments);
    
   },
   
   // Setup the buttons.
   setUpButtons: function(){
	   if(this.buttonLeft !== ''){
			var leftBtn = Ext.get(this.buttonLeft);
			leftBtn.applyStyles({display: 'inline'});
			leftBtn.on('mouseup',function(e, t, eOpts){
				this.rotate(-1);	
				return false;
			}, this);
		}	
		if(this.buttonRight !== ''){
			var rightBtn = Ext.get(this.buttonRight);
			rightBtn.applyStyles({display: 'inline'});
			rightBtn.on('mouseup',function(e, t, eOpts){															
				this.rotate(1);	
				return false;
			}, this);
		}
   },
   
   goToIndex:function(index){
       if(this.frontIndex >0){
           if(this.frontIndex < this.items.length/2){
               this.rotate(Math.abs(index - this.frontIndex));
           }else{
               this.rotate(Math.abs(index - this.frontIndex));
           }
       }else{
           if(this.frontIndex < this.items.length/2){
               this.rotate(-Math.abs(index - this.frontIndex));
           }else{
               this.rotate(-Math.abs(index - this.frontIndex));
           }
       }
   },
   
   goToFirst:function(){
       if(this.frontIndex >0){
           if(this.frontIndex < this.items.length/2){
               this.rotate(Math.abs(this.frontIndex));
           }else{
               this.rotate(Math.abs(this.frontIndex));
           }
       }else{
           if(this.frontIndex < this.items.length/2){
               this.rotate(-Math.abs(this.frontIndex));
           }else{
               this.rotate(-Math.abs(this.frontIndex));
           }
       }
       this.frontIndex = 0;
        
   },
   
   goToLast:function(){
       if(this.frontIndex >0){
           if(this.frontIndex < this.items.length/2){
               this.rotate(Math.abs(this.items.length - this.frontIndex));
           }else{
               this.rotate(Math.abs(this.items.length - this.frontIndex));
           }
       }else{
           if(this.frontIndex < this.items.length/2){
               this.rotate(-Math.abs(this.frontIndex + this.frontIndex));
           }else{
               this.rotate(-Math.abs(this.frontIndex + this.frontIndex));
           }
       }
       this.frontIndex = 0;
        
   },
   
   setUpContainerListener: function(){
		this.container.on({
                          onkeypress:function(){
                                console.log('asdasd')
                          },
			  'click' : {
				  fn: this.containerMouseClickHandler,
				  scope: this
			  },
			  'mouseover' : {
				  fn: this.containerMouseOverHandler,
				  scope: this
			  },
			  'mouseout' : {
				  fn: this.containerMouseOutHandler,
				  scope: this
			  },
			  'mousedown' : {
				  fn: this.containerMouseDownHandler,
				  scope: this
			  },
               'dblclick':{
                    fn:this.containerDoubleClickHandler,
                    scope:this
              }
		});
   },
   
   containerMouseOverHandler: function(e, t, eOpts){
		// Stop auto rotation if mouse over.
		clearInterval(this.autoRotateTimer);
		// get srcElement if target is falsy (IE)
		var targetElement = e.target || e.srcElement;		
		var	text = targetElement.getAttribute('alt');		
		// If we have moved over a carousel item, then show the alt and title text.	
		if ( text !== undefined && text !== null ){
				
			clearTimeout(this.showFrontTextTimer);
			if(this.altBox !== '')
//                            Ext.getCmp(this.altBox).setText(targetElement.getAttribute('alt'));
//				Ext.get(this.altBox).update(targetElement.getAttribute('alt'));	
			if(this.titleBox !== '')
				Ext.get(this.titleBox).update(targetElement.getAttribute('title'));
		}
   },
   
   containerMouseClickHandler: function(e, t, eOpts){
		// get srcElement if target is falsy (IE)
		var targetElement = e.target || e.srcElement;
//                var width = targetElement.getAttribute('width');
		var	text = targetElement.getAttribute('alt');
        var images = this.store.data.items;
		if ( text !== undefined && text !== null ){
			if ( this.bringToFront){	
				var	idx = targetElement.getAttribute('itemIndex');	
                var frontIndex = this.frontIndex;
				var	diff = idx - frontIndex;                    
				var diff = (idx - frontIndex) % images.length;
				if (Math.abs(diff) > images.length / 2) {
					diff += (diff > 0 ? -images.length : images.length);
				}
				
				this.rotate(-diff);
			}
		}
                
//        if(e.getX() < this.getWidth()*0.20){
//           this.rotate(-1);
//           }else if(e.getX() > this.getWidth()*0.80){
//            this.rotate(1);
//        }
        
   },
   
   containerDoubleClickHandler: function(e, t, eOpts){
		var targetElement = e.target || e.srcElement;
		var	text = targetElement.getAttribute('alt');
                var     images = this.store.data.items;
		if ( text !== undefined && text !== null ){
                    var w = window.open();
                    w.document.write('<img src='+ this.store.data.items[targetElement.getAttribute('itemIndex')].data.imageSrc+'>');
                    
		}
        
   },
   
   // If we have moved out of a carousel item (or the container itself),
   // restore the text of the front item in 1 second.
   containerMouseOutHandler: function(e, t, eOpts){
		var me = this;
		clearTimeout(this.showFrontTextTimer);				
		this.showFrontTextTimer = setTimeout( function(){me.showFrontText();},1000);
		// Start auto rotation.
		this.autoRotateFn();	
   },
   
   // Prevent items from being selected as mouse is moved and clicked in the container.
   containerMouseDownHandler: function(e, t, eOpts){
		this.container.focus();
		return false;
   },
	// Shows the text from the front most item.
	showFrontText: function() {
		// Images might not have loaded yet.	
		if (this.items[this.frontIndex] === undefined ) { return; }					
	},
	
	go: function(){				
		if(this.controlTimer !== 0) { return; }
		var	me = this;
		this.controlTimer = setTimeout( function(){me.updateAll();},me.timeDelay);					
	},
	
    stop: function() {
		clearTimeout(this.controlTimer);
		this.controlTimer = 0;				
	},	
	
	// Starts the rotation of the carousel. Direction is the number (+-) of carousel items to rotate by.
	rotate: function(direction){
		this.items = this.items.items || this.items;	
		this.frontIndex -= direction;
		this.frontIndex %= this.items.length;					 			
		this.destRotation += ( Math.PI / this.items.length ) * ( 2*direction );
		this.showFrontText();
		this.go();	
                var index = this.frontIndex
                if(this.frontIndex<0){
                    index = this.items.length + this.frontIndex;
                    this.frontIndex = index;
                }
                Ext.ComponentQuery.query('label[name='+this.altBox+']')[0].setText((this.items[index]).alt); 
                
	},
	
	autoRotateFn: function(){		
		var me = this;
		if ( this.autoRotate !== 'no' ) {
			var	dir = (this.autoRotate === 'right')? 1 : -1;
			this.autoRotateTimer = setInterval( function(){me.rotate(dir); }, me.autoRotateDelay );
		}
	},
	
	updateAll: function(){
	    var me = this
		var	minScale = this.minScale;	// This is the smallest scale applied to the furthest item.
		me.items = this.items;
		var smallRange = (1-minScale) * 0.5;
		var	w,h,x,y,scale,item,sinVal;
		
		var	change = (this.destRotation - this.rotation);				
		var	absChange = Math.abs(change);

		this.rotation += change * this.speed;
		if ( absChange < 0.001 ) { this.rotation = this.destRotation; }			
		var	itemsLen = me.items.length;
		var	spacing = (Math.PI / itemsLen) * 2; 
		var	radians = this.rotation;
		var	isMSIE = Ext.isIE;
	
		// Turn off display. This can reduce repaints/reflows when making style and position changes in the loop.
		// See http://dev.opera.com/articles/view/efficient-javascript/?page=3			
		this.innerWrapper.setStyle({display : 'none'});
		
		var	style;
		var	px = 'px', reflHeight;	
		for (var i = 0; i<itemsLen ;i++)
		{
			item = me.items[i];
			item.imageOK = true;				
			sinVal = me.calculateSin(radians);
			
			scale = ((sinVal+1) * smallRange) + minScale;
			
			x = this.xCentre + (( (me.calculateCos(radians) * this.xRadius) - (item.orgWidth*0.5)) * scale);
			y = this.yCentre + (( (sinVal * this.yRadius)  ) * scale);		
	
			if (item.imageOK)
			{
				var	img = item.image;
				w  = item.orgWidth * scale;			
				h = item.orgHeight * scale;
				img.set({
					width: w,
//					height: h
				});
				img.setStyle({
					left : x + 'px',
					top: y + 'px',
					zIndex: '' + (scale * 100)>>0
				});

				if (item.reflection !== null)
				{																										
					reflHeight = me.reflHeight * scale;						
					style = item.reflection.element.dom.style;
					item.reflection.element.setStyle({
						left: x + 'px',
						top: y + h + me.reflGap * scale + 'px',
						width: w + 'px'
					});
							
					if (isMSIE)
					{											
						style.filter.finishy = (reflHeight / h * 100);				
					}else
					{								
						item.reflection.element.setStyle({height : reflHeight + 'px'});															
					}																													
				}					
			}
			radians += spacing;
		}
		// Turn display back on.					
		this.innerWrapper.setStyle({display : 'block'});
		
		// If we have a preceptable change in rotation then loop again next frame.
		if ( absChange >= 0.001 )
		{				
			this.controlTimer = setTimeout( function(){me.updateAll();},this.timeDelay);		
		}else
		{
			// Otherwise just stop completely.				
			this.stop();
		}
	},
	
	// Check if images have loaded. We need valid widths and heights for the reflections.
	checkImagesLoaded: function() {
		var	me =this, items = [];
		Ext.each(me.store.data.items, function(item, index) {
                    item.data.itemIndex = index;
			var image = Ext.create('app.component.Image',{
					itemIndex: index,
					alt: item.get('alt'),
					title: item.get('title'),
					container: me.innerWrapper,
					orgWidth: 300, //160			
					orgHeight: 200,
					imageSrc: item.get('imageSrc'),
					reflHeight: me.reflHeight,
					reflOpacity: me.reflOpacity
				});
			items.push(image);
			me.innerWrapper.appendChild(image.getImage());
			image.setUpReflection();
		});
		me.items = items;
        me.items.items = items;
		// If all images have valid widths and heights, we can stop checking.			
		clearInterval(0);
		this.showFrontText();
		this.autoRotateFn();	
		this.updateAll();
        Ext.ComponentQuery.query('label[name='+this.altBox+']')[0].setText((this.items[0]).alt); 
	},
	
	initStore: function(){
		if(this.store == null || this.store == undefined){
			this.store = Ext.create('app.store.carousel.CarouselStore', {});
			this.images = this.store.data.items;
		}
	},
	
   /**
    * Returns the sine of x (x is in radians)
	* @param {Number} the number to calculate its sine.
	* @return {Number}.
	*/
   calculateSin: function(x){
		return Math.sin(x);
   },
   
   /**
    * Returns the cosine of x (x is in radians)
	* @param {Number} the number to calculate its cosine.
	* @return {Number}.
	*/
   calculateCos: function(x){
		return Math.cos(x);
   },
   
   getStore: function(){
		return this.store;
   },
   
    /**
	 * Writes log in the console.
	 * @param {String} the log message to show.
	 */
    log: function(msg) {
        console.log(msg);
    },
    
	/**
	 * Throws exception.
	 * @param {String} the method name where the exception was occurred.
	 * @param {String} the error message to show.
	 */
    throwException: function(method, message){
    	Ext.Error.raise({
            sourceClass: 'app.ux.Carousel',
            sourceMethod: method,
            msg: message
        });
    }  

});

