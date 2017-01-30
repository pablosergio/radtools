/**
 * @author Aymen ABDALLAH <aymen.abdallah@gmail.com>
 * @docauthor Aymen ABDALLAH
 * @class Ext.component.Reflection
 */
Ext.define('app.component.Reflection', {
	config: {
 		imageHeight: 0,
		imageWidth: 0,
		image: null,
		reflHeight: 0,
		reflOpacity: 0,
		element: null
	},
	
	constructor: function(config){
		this.initConfig(config);
		this.initReflection();
	},

	initReflection: function(){
		var me = this, reflection, cntx, gradient, parent = Ext.get(this.image.id).parent();	
		this.element = reflection = parent.createChild({ tag : 'canvas', id: me.image.id + '-refl', cls: 'reflection', style: 'position:absolute'});
        if ( !reflection.dom.getContext &&  Ext.isIE) {
			this.element = reflection = parent.createChild({ tag : 'img', cls: 'reflection', style: 'position:absolute' });
			reflection.set({src : me.image.getAttribute('src')});			
			reflection.setStyle({filter : "flipv progid:DXImageTransform.Microsoft.Alpha(opacity=" + (me.opacity * 100) + ", style=1, finishOpacity=0, startx=0, starty=0, finishx=0, finishy=" + (me.reflHeight / me.imageHeight * 100) + ")"});	
			
        } else {							
			cntx = reflection.dom.getContext("2d");
			try {
				reflection.set({width: me.imageWidth, height: me.reflHeight});
				cntx.save();
				cntx.translate(0, me.imageHeight-1);
				cntx.scale(1, -1);
				var refImg = new Image();
				refImg.src = me.image.getAttribute('src');			
				cntx.drawImage(refImg, 0, 0, me.imageWidth, me.imageHeight);				
				cntx.restore();
				cntx.globalCompositeOperation = "destination-out";
				gradient = cntx.createLinearGradient(0, 0, 0, me.reflHeight);
				gradient.addColorStop(0, "rgba(255, 255, 255, " + (1 - me.reflOpacity) + ")");
				gradient.addColorStop(1, "rgba(255, 255, 255, 1.0)");
				cntx.fillStyle = gradient;
				cntx.fillRect(0, 0, me.imageWidth, me.reflHeight);	
			} catch(e) {			
				return;
			}	
		}
		// Store a copy of the alt and title into the reflection
		reflection.set({ alt: me.image.getAttribute('alt'), title: me.image.getAttribute('title')} );		
	}

});