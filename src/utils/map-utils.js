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
export const markClicked = (map, event) => {

  const L = window.L;

  const targetIcon = L.icon({
      iconUrl: locationIcon,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, 0],
  });

  L.marker([event.latlng.lat, event.latlng.lng], {icon: targetIcon}).addTo(map);
};