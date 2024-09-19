import locationIcon from '@images/location_searching_FILL0_wght400_GRAD0_opsz24.png';

// import basemap thumbnails
import USGSTopo from '@images/basemaps/USGS-US-Topo.png';
import USGSImagery from '@images/basemaps/USGS-US-Imagery.png';
import CartoDBPositron from '@images/basemaps/CartoDB-Positron.png';
import { useLocation } from "react-router-dom";

/**
 * deconstructs the app params
 *
 */
export const config = {
    // AWS params
    REACT_APP_GS_DATA_URL_AWS: process.env.REACT_APP_GS_DATA_URL_AWS,
    REACT_APP_UI_DATA_URL_AWS: process.env.REACT_APP_UI_DATA_URL_AWS,
    REACT_APP_UI_DATA_TOKEN_AWS: process.env.REACT_APP_UI_DATA_TOKEN_AWS,
    REACT_APP_HURRICANE_ICON_URL_AWS: process.env.REACT_APP_HURRICANE_ICON_URL_AWS,

    // Production params
    REACT_APP_GS_DATA_URL_PROD: process.env.REACT_APP_GS_DATA_URL_PROD,
    REACT_APP_UI_DATA_URL_PROD: process.env.REACT_APP_UI_DATA_URL_PROD,
    REACT_APP_UI_DATA_TOKEN_PROD: process.env.REACT_APP_UI_DATA_TOKEN_PROD,
    REACT_APP_HURRICANE_ICON_URL_PROD: process.env.REACT_APP_HURRICANE_ICON_URL_PROD,

    // Dev params
    REACT_APP_GS_DATA_URL_DEV: process.env.REACT_APP_GS_DATA_URL_DEV,
    REACT_APP_UI_DATA_URL_DEV: process.env.REACT_APP_UI_DATA_URL_DEV,
    REACT_APP_UI_DATA_TOKEN_DEV: process.env.REACT_APP_UI_DATA_TOKEN_DEV,
    REACT_APP_HURRICANE_ICON_URL_DEV: process.env.REACT_APP_HURRICANE_ICON_URL_DEV,

    // local (debug) params
    REACT_APP_GS_DATA_URL_LOCAL: process.env.REACT_APP_GS_DATA_URL_LOCAL,
    REACT_APP_UI_DATA_URL_LOCAL: process.env.REACT_APP_UI_DATA_URL_LOCAL,
    REACT_APP_UI_DATA_TOKEN_LOCAL: process.env.REACT_APP_UI_DATA_TOKEN_LOCAL,
    REACT_APP_HURRICANE_ICON_URL_LOCAL: process.env.REACT_APP_HURRICANE_ICON_URL_LOCAL
};

/**
 * gets a query string param based on the FQDN
 *
 */
export const getBrandingHandler = () =>  {
    // init the return value
    let ret_val = '';

    // if this is a nopp branding
    if(window.location.href.includes('nopp')) {
        // use local host values
        ret_val = '&project_code=nopp';
    }

    // return the query string
    return ret_val;
};

/**
 * gets the header data property name index
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @param type
 * @returns {string}
 */
export const getPropertyName = (layerProps, element_name) => {
    // init the return
    let ret_val = undefined;

    // capture the name of the element for tropical storms and advisory numbers
    if (layerProps['met_class'] === 'tropical') {
        // by the element name
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['storm_name'];
                break;
            case 'numberName':
                ret_val = ' Adv: ';
                break;
            case 'numberEle':
                ret_val = layerProps['advisory_number'];
                break;
        }
    }
    // capture the name of the synoptic ADCIRC models and cycle numbers
    else {
        switch (element_name) {
            case 'stormOrModelEle':
                ret_val = layerProps['model'];
                break;
            case 'numberName':
                ret_val = ' Cycle: ';
                break;
            case 'numberEle':
                ret_val = layerProps['cycle'];
                break;
        }
    }

    // return to the caller
    return ret_val;
};

/**
 * gets the summary header text for the layer groups.
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @returns {string}
 */
export const getHeaderSummary = (layerProps) => {
    // get the full accordian summary text
    return layerProps['run_date'] + ': ' +
        ((getPropertyName(layerProps, 'stormOrModelEle') === undefined) ? 'Data error' : getPropertyName(layerProps, 'stormOrModelEle').toUpperCase()) +
        ', ' + getPropertyName(layerProps, 'numberName') + getPropertyName(layerProps, 'numberEle') +
        ', Type: ' + layerProps['event_type'] +
        ', Grid: ' + layerProps['grid_type'] +
        ', Instance: ' + layerProps['instance_name'] +
        ((layerProps['meteorological_model'] === 'None') ? '' : ', ' + layerProps['meteorological_model']);
};

/**
 * gets an env param that includes the namespace for env param retrieval
 *
 * @param param
 * @returns {string}
 */
export const getNamespacedEnvParam = (param) => {
    // init the namespace value
    let namespace = '';

    // make sure there is a param to work with
    if (param.length)  {
        // determine the host name values
        if(window.location.href.includes('local')) {
            // use local host values
            namespace = 'LOCAL';
        }
        else if (window.location.href.includes('renci')) {
            // use dev host values if dev is in the hostname
            if (window.location.href.includes('-dev')) {
                namespace = 'DEV';
            }
            // else use prod host values
            else {
                namespace = 'PROD';
            }
        }
        else if (window.location.href.includes('adcirc')) {
            // use AWS hostname values
            namespace = 'AWS';
        }
    }

    // init the return variable
    let ret_val ='';

    // make sure the namespace exists
    if (namespace.length) {
        // build the return value
        ret_val = param + '_' + namespace;
    }

    // return the param value type
    return config[ret_val];
};

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

/**
 * parses the hash section of the url used for sharing
 *
 */
export const parseSharedURL = () => {
    // get the hash location from the URL (if any)
    const { hash } = useLocation();

    // init the return variables
    let run_id = '';
    let comment = '';
    let obs = '';

    // if there was a hash code
    if (hash !== '') {
        // get the hash payload
        const payload = hash.split('~');

        // did we get a valid payload?
        if (payload.length === 3) {
            // get the run id. this is used on another data query string so add the param
            run_id = (payload[0].split('run_id:')[1] !== undefined && payload[0].split('run_id:')[1] !== '') ? '&run_id=' + payload[0].split('run_id:')[1] : '';

            // get the comment
            comment = (payload[1].split('comment=')[1] !== undefined && payload[1].split('comment=')[1] !== '') ? decodeURI(payload[1].split('comment=')[1]) : '';

            // get the selected observations
            obs = (payload[2].split('obs=')[1] !== undefined && payload[2].split('obs=')[1] !== '') ? JSON.parse(decodeURI(payload[2].split('obs=')[1])) : '';
        }
    }

    // return the shared URL to the caller
    return {'run_id': run_id, 'comment': comment, 'obs': obs};
};

/**
 * Adds the observations that come in on the shared query string
 *
 * @param map
 * @param obs
 * @param setSelectedObservations
 */
export const addSharedObservations = (map, obs, setSelectedObservations )=> {
    // if there are observations, put them on the map
    if(obs) {
        // clear out the current selected observation dialogs
        setSelectedObservations([]);

        // put a target icon on the map and observation data in state
        obs.forEach(r => {
            // put the target icons on the map
            markClicked(map, {'latlng': {'lat': r.lat, 'lng': r.lng}}, r.id);

            // add the selected observation data into state
            setSelectedObservations(previous => [...previous, r]);
        });
    }
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