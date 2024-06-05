import locationIcon from '@images/location_searching_FILL0_wght400_GRAD0_opsz24.png';

// import basemap thumbnails
import USGSTopo from '@images/basemaps/USGS-US-Topo.png';
import USGSImagery from '@images/basemaps/USGS-US-Imagery.png';
import CartoDBPositron from '@images/basemaps/CartoDB-Positron.png';


// function to add a location marker where ever and obs mod layer
// feature is clicked icon downloaded as png from here: 
// https://fonts.google.com/icons?selected=Material+Symbols+Outlined:location_searching:FILL@0;wght@400;GRAD@0;opsz@24&icon.query=location
export const markClicked = (map, event, id) => {

  const L = window.L;
  const iconSize = 38;
  const iconAnchor = iconSize/2;

  const targetIcon = L.icon({
      iconUrl: locationIcon,
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconAnchor, iconAnchor],
      popupAnchor: [0, 0],
  });

  const marker = L.marker([event.latlng.lat, event.latlng.lng], {icon: targetIcon});
  marker._id = id;
  
  marker.addTo(map);
};


export const markUnclicked = (map, id) => {

  map.eachLayer((layer) => {
    if (layer.options && layer.options.pane === "markerPane") {
      if (layer._id === id) {
        map.removeLayer(layer);
      }
    }
  });
};

// add any new basemaps here
// TODO: need to figure out how to deal with Dark Mode
export const BasemapList = [
  {url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',
   attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
   title: 'USGS Topo',
   thumbnail: USGSTopo
  },
  {url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>',
    title: 'USGS Imagery Topo',
    thumbnail: USGSImagery
  },
  {url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    title: 'CartoDB-Positron',
    thumbnail: CartoDBPositron
  }
];