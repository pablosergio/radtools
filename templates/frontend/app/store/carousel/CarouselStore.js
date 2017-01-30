/**
 * @author Aymen ABDALLAH <aymen.abdallah@gmail.com>
 * @docauthor Aymen ABDALLAH
 */
Ext.define('app.store.carousel.CarouselStore', {
    extend: 'Ext.data.Store',
   	proxy: {
    	type: "memory"
  	},
    autoLoad:true,
    model: 'app.model.carousel.Carousel',

    data: [{
			imageSrc:"./resources/images/condominio-alamos.jpg",
			title:"Condominio Familiar Moderno",
			alt: "Condominio Familiar Moderno"
		},{
			imageSrc:"./resources/images/conserjeria.JPG",
			title:"Servicio de Conserjeria",
			alt: "Servicio de Conserjeria"
		},{
			imageSrc:"./resources/images/servicio-limpieza.jpg",
			title:"Servicio de Limpieza",
			alt: "Servicio de Limpieza"
		},{
			imageSrc:"./resources/images/salon-eventos.jpg",
			title:"Salon de Eventos",
			alt: "Salon de Eventos"
		},{
			imageSrc:"./resources/images/parrillero.jpg",
			title:"Parrillero ",
			alt: "Parrillero"
		}
	]
});