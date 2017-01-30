/**
 * @author Aymen ABDALLAH <aymen.abdallah@gmail.com>
 * @docauthor Aymen ABDALLAH
 */
Ext.define('app.model.carousel.Carousel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'imageSrc', type: 'string', mapping:'imageSrc' },
        { name: 'dt_date', type: 'string'},
        { name: 'alt', type: 'string' },
        { name: 'itemIndex', type: 'string' }
    ]
});