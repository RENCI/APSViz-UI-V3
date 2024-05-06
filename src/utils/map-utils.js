//import { useLayers } from '@context';
import locationIcon from '@images/location_searching_FILL0_wght400_GRAD0_opsz24.png';

/* const {
  defaultModelLayers,
  setDefaultModelLayers,
  filteredModelLayers,
  setFilteredModelLayers
  } = useLayers(); */


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
}