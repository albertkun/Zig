var map;

var styleCache = {};
var geoLayer = new ol.layer.Vector({
	source : new ol.source.GeoJSON({
		projection : 'EPSG:900913',
		url : './myGeoJson.geojson'
	}),
	style : function(feature, resolution) {
		var text = resolution < 5000 ? feature.get('name') : '';
		if (!styleCache[text]) {
			styleCache[text] = [new ol.style.Style({
				fill : new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.1)'
				}),
				stroke : new ol.style.Stroke({
					color : '#319FD3',
					width : 1
				}),
				text : new ol.style.Text({
					font : '12px Calibri,sans-serif',
					text : text,
					fill : new ol.style.Fill({
						color : '#000'
					}),
					stroke : new ol.style.Stroke({
						color : '#fff',
						width : 3
					})
				}),
				zIndex : 999
			})];
		}
		return styleCache[text];
	}
});

function init() {
	map = new ol.Map({
		target : 'map',
		renderer : 'canvas',
		view : new ol.View2D({
			projection : 'EPSG:900913',
			center : [-8015003.33712, 4160979.44405],
			zoom : 5
		})
	});

	var newLayer = new ol.layer.Tile({
		source : new ol.source.OSM()
	});

	map.addLayer(newLayer);

	var vectorLayer = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			url : 'http://felek.cns.umass.edu:8080/geoserver/wms',
			serverType : 'geoserver',
			params : {
				'LAYERS' : "Streams:Developed",
				'TILED' : true
			}
		})
	});

	map.addLayer(vectorLayer);

	var vectorLayer_2 = new ol.layer.Tile({
		source : new ol.source.TileWMS({
			preload : Infinity,
			url : 'http://felek.cns.umass.edu:8080/geoserver/wms',
			serverType : 'geoserver',
			params : {
				'LAYERS' : "Streams:Deposition_of_Nitrogen",
				'TILED' : true
			}
		})
	});

	map.addLayer(vectorLayer_2);

	map.addLayer(geoLayer);

	//Zoom
	var myZoom = new ol.control.Zoom();
	map.addControl(myZoom);
	//Zoom is a default control, but there are some parameters you could change if you wanted:
	//Check them out here: http://ol3js.org/en/master/apidoc/ol.control.Zoom.html

	//ZoomSlider
	var myZoomSlider = new ol.control.ZoomSlider();
	map.addControl(myZoomSlider);
	//The zoom slider is a nice addition to your map. It is wise to have it accompany your zoom buttons.

	//Full Screen
	var myFullScreenControl = new ol.control.FullScreen();
	map.addControl(myFullScreenControl);

	//ZoomToExtent
	var myExtentButton = new ol.control.ZoomToExtent({

	});
	map.addControl(myExtentButton);

	map.on('singleclick', function(evt){
		console.log(evt);
	})

}

function removeTopLayer() {
	var layers = map.getLayers();
	layers.pop();
}

function swapTopLayer() {
	var layers = map.getLayers();
	var topLayer = layers.removeAt(2);
	layers.insertAt(1, topLayer);
}

