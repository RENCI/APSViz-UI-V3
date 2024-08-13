import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { useLayers } from '@context/map-context';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  IconButton,
  Stack,
  Switch,
  ToggleButtonGroup,
  Typography,
} from '@mui/joy';
import {
  Air as MaxWindVelocityIcon,
  Flood as MaxInundationIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Tsunami as SwanIcon,
  Water as MaxElevationIcon,
  Waves as HIResMaxElevationIcon,
} from '@mui/icons-material';
import { getBrandingHandler, getNamespacedEnvParam } from "@utils/map-utils";
import { Branding } from './branding';

const layerIcons = {
  maxele63: <MaxElevationIcon />,
  maxwvel63: <MaxWindVelocityIcon />,
  swan_HS_max63: <SwanIcon />,
  maxinundepth63: <MaxInundationIcon />,
  maxele_level_downscaled_epsg4326: <HIResMaxElevationIcon />,
};

export const ControlPanel = () => {

  const { map,
          selectedObservations,
          setSelectedObservations,
          defaultModelLayers,
          hurricaneTrackLayers,
          setDefaultModelLayers,
          getAllLayersInvisible,
          toggleLayerVisibility,
          toggleHurricaneLayerVisibility } = useLayers();

  const data_url = `${ getNamespacedEnvParam('REACT_APP_UI_DATA_URL') }` + `get_ui_data_secure?limit=1&use_v3_sp=true${ getBrandingHandler() }`;
  const layers = [...defaultModelLayers];
  const hurrLayers = [...hurricaneTrackLayers];

   // keep track of which model run to retrieve
  let runCycle = "";
  let runAdvisory = "";
  let runDate = "";
  let instanceName = "";
  let metClass = "";
  let eventType = "";
  let stormName = "";
  let runGrid = "";
  let topRunId = "";
  let currentLayerSelection = "";
  
  // collect the top layers - those are all we are concerned with
  //  in the control panel
  let firstId = "";
  const topLayers  = layers.filter((layer, idx) => {
    if (idx === 0) {
      firstId = layer.id.substr(0, layer.id.lastIndexOf("-"));
    }
    // check to make sure they are all from the same model run
    if (layer.id.substr(0, layer.id.lastIndexOf("-")) === firstId) {
      return {
        ...layer
      };
    }
  });
  if (topLayers[0]) {
    runCycle = topLayers[0].properties.cycle;
    runAdvisory = topLayers[0].properties.advisory_number;
    runDate = topLayers[0].properties.run_date;
    instanceName = topLayers[0].properties.instance_name;
    metClass = topLayers[0].properties.met_class;
    eventType = topLayers[0].properties.event_type;
    runGrid = topLayers[0].properties.grid_type;
    stormName = topLayers[0].properties.storm_name;
    topRunId = topLayers[0].id.split("-")[0];

    // find the current layer selection
    const selectedLayer = topLayers.find((layer) => layer.properties.product_type !== "obs" && layer.state.visible === true);
    if (selectedLayer) {
      currentLayerSelection = selectedLayer.properties.product_type;
    }
  }   
  const maxele_layer = layers.find((layer) => layer.properties.product_type === "maxele63");
  const obs_layer = layers.find((layer) => layer.properties.product_type === "obs");

  //const [topRunId, setTopRunId] = useState();
  const [filters, setFilters] = useState();

 // if (topLayers[0]) setTopRunId(topLayers[0].id);

  // when cycle buttons are pushed on the control panel
  // either the previous or next cycle of the displayed 
  // adcirc model run will be displayed on the map
  // if the run is not already in memory, it will have
  // to be retrieved from the get_ui_data api
  // retrieve adcirc data and layers from filter data provided
  // then populate default layers state
  // all params are strings, and runDate format is YYYY-MM-DD

  const newLayerDefaultState = (layer) => {
    const { product_type } = layer.properties;
  
    if (['obs', currentLayerSelection].includes(product_type)) {
      return ({
        visible: true,
        opacity: 1,
      });
    }
  
    return ({
      visible: false,
      opacity: 1,
    });
  };

  const matchNewTropicalRunId = (layer) => {
    return (layer.id.split("-")[0] === topRunId);
  };

  const parseAndAddLayers = (d) => {

    // first see if this set of layers already exists in default layers
    if (d.catalog[0].members && defaultModelLayers.find(layer => layer.id === d.catalog[0].members[0].id)) {
      // get all layers in defaultModelLayers that match
      // the new catalog member layers
      const tLayers = defaultModelLayers.filter(t =>
        d.catalog[0].members.some(member => member.id === t.id)
      );

      // now get get layers in defaultModelLayers that
      // remain after new catalog member layers are removed
      const rLayers = defaultModelLayers.filter(r =>
        !d.catalog[0].members.some(member => member.id === r.id)
      );

      // set default state for new layers going on top.
      tLayers.forEach(r => {
          r.state = newLayerDefaultState(r);
      });
      // all remaining layers should be turned off
      rLayers.forEach(r => {
        r.state = { visible: false, opacity: 1, };
      });

      // now repopulate defaultModelLayers with memberlayers on top
      setDefaultModelLayers([...tLayers, ...rLayers]);
    }
    // if not, add these layers to default layers
    else {
      const currentLayers = getAllLayersInvisible();
      // add visibity state property to retrieved catalog layers
      const newLayers = [];
      d.catalog[0].members.forEach((layer) => {
        if (matchNewTropicalRunId(layer)) {
          newLayers.push({
                ...layer,
                state: newLayerDefaultState(layer)
            });
        }
      });
      setDefaultModelLayers([...newLayers, ...currentLayers]);
    }
  };

  // useQuery function
  const setNewLayers = async() => {
      // create the authorization header
        const requestOptions = {
            method: 'GET',
            headers: { Authorization: `Bearer ${ getNamespacedEnvParam('REACT_APP_UI_DATA_TOKEN') }` },
            params: filters
        };

    // retrieve the set of layers for the new cycle
    const { isError, data, error } = await axios.get(data_url, requestOptions);

    if (isError) {
        alert(error);
    } else {
        // add data returned to default layers, if they are not already there.
        parseAndAddLayers(data);
    }
    return(data);
  };
  useQuery( {queryKey: ['apsviz-data', filters], queryFn: setNewLayers, enabled: !!filters});


  const date2String = (date) => {
    return date.getFullYear() +
                '-' + String(date.getMonth() + 1).padStart(2, '0') +
                '-' + String(date.getDate()).padStart(2, '0');
  };

  const string2Date = (str) => {
    const dateParts = str.split('-');

    return new Date(dateParts[0], dateParts[1]-1, dateParts[2]);
  };
  
  // switch to the model run layer selected via icon button
  const layerChange = async (event, newValue) => {

     // turn off the old just check for top instance
    topLayers.map(layer => {
      if (layer.layers.includes(currentLayerSelection)) {
          toggleLayerVisibility(layer.id);
      }
    }); 
  
    // Yikes! need another way to do this - but it works for now
    await new Promise(r => setTimeout(r, 1));
    // turn on the new
    topLayers.map(layer => {
      if (layer.layers.includes(newValue)) {
          toggleLayerVisibility(layer.id);
      }
    });
    currentLayerSelection = newValue;
  };

  // switch on/off the observation layer if it exists
  const toggleObsLayer = () => {
    toggleLayerVisibility(obs_layer.id);

    // remove all the "target" overlays from state
    map.eachLayer((layer) => {
        // if this is an observation selection marker
        if (layer.options && layer.options.pane === "markerPane") {
            // remove the layer
            map.removeLayer(layer);
        }
    });

    // remove all the observation dialogs from state
    setSelectedObservations(selectedObservations.filter(item => item === undefined));
  };

  // switch on/off the hurricane track layer, if it exists
  const toggleHurricaneLayer = () => {
    const layerID = obs_layer.id.substr(0, obs_layer.id.lastIndexOf("-")) + '-hurr';
    toggleHurricaneLayerVisibility(layerID);
  };

  const changeSynopticCycle = (direction) => {

    const currentDate = string2Date(runDate);
    let currentCycle = Number(runCycle);

    if (direction === "next") {
        // set properties for next model run
        if (currentCycle === 18) { // need to push date to next day
            currentDate.setDate(currentDate.getDate() + 1);
            currentCycle = 0;
        } else {
            currentCycle += 6;
        }
    } else {  // previous
        // set properties for previous model run
        if (currentCycle === 0) { // need to push date to previous day
            currentDate.setDate(currentDate.getDate() - 1);
            currentCycle = 18;
        } else {
            currentCycle -= 6;
        }
    }

    runDate = date2String(currentDate);
    runCycle = String(currentCycle).padStart(2, '0');

    const newFilters = {"instance_name": instanceName,
                        "met_class": metClass,
                        "event_type": eventType,
                        "storm_name": stormName,
                        "cycle": runCycle,
                        "run_date": runDate
    };

    setFilters(newFilters);
  };

  const changeTropicalAdvisory = (direction) => {
    let currentAdvisory = Number(runAdvisory);

    // set properties for next model run
    if (direction === "next") {
        currentAdvisory += 1;
    } else {  // previous
        // set properties for previous model run
        currentAdvisory -= 1;
    }

    runAdvisory = String(currentAdvisory).padStart(3, '0');

    const newFilters = {"instance_name": instanceName,
                        "met_class": metClass,
                        "event_type": eventType,
                        "storm_name": stormName,
                        "advisory_number": runAdvisory,
                        "grid_type": runGrid
    };

    setFilters(newFilters);
  };

  // cycle to the next/previous model run cycle
  // or advisory and retrieve the layers associated
  // with that cycle/date or advisory
  const changeModelRunCycle = (e) => {
    const direction = e.currentTarget.getAttribute("button-key");
    metClass === "synoptic" ? changeSynopticCycle(direction) : changeTropicalAdvisory(direction);
  };

  return (
    <Accordion
      variant="soft"
      defaultExpanded={true}
      sx={{
        p: 0,
        position: 'absolute',
        bottom: 'calc(4 * var(--joy-spacing))',
        right: 'calc(4 * var(--joy-spacing))',
        transition: 'filter 250ms',
        filter: 'opacity(0.9)',
        '&:hover': { filter: 'opacity(1.0)' },
        height: 'auto',
        width: '300px',
        zIndex: 410,
        borderRadius: 'sm',
      }}
    >
      <AccordionSummary slotProps={{buttonClasses: {size: 'xx-large'}}}>
        <Branding/>
      </AccordionSummary>
      <AccordionDetails sx={{'marginBottom': '15px'}}>
      <Stack direciton="column" gap={ 1 } alignItems="center">
        <Divider />
        {
          layers.length && (
            <Fragment>
            <Typography level="body-md" alignSelf="center">
              {metClass === 'tropical'? `Storm Name ${stormName}` : ''}
            </Typography>
            <Typography level="body-md" alignSelf="center">
              Model run date: {runDate}
            </Typography>
            </Fragment>
          )
        }

        <Stack direction="row" alignItems="center" gap={ 1 }>
            <IconButton
              variant="outlined"
              key='previous'
              button-key='previous'
              onClick={changeModelRunCycle}
            ><KeyboardArrowLeft/></IconButton>
            <Typography level="body-md">{metClass === 'synoptic'? `Cycle ${runCycle}` : `Advisory ${runAdvisory}`}</Typography>
            <IconButton
              variant="outlined"
              key='next'
              button-key='next'
              onClick={changeModelRunCycle}
            ><KeyboardArrowRight/></IconButton>
        </Stack>

        <Divider />
        
        { // grid name
          layers.length && (
            <Typography level="body-md">{layers[0].properties.grid_type} grid</Typography>
          )
        }

        { // observations toggle
          layers.some(layer => layer.properties.product_type === "obs") && (
            <Typography
              component="label"
              endDecorator={ <Switch checked={obs_layer.state.visible} onChange={toggleObsLayer} /> }
            >Observations</Typography>
          )
        }

        { // hurricane track toggle
          layers.some(layer => layer.properties.met_class === "tropical") && hurrLayers[0] && (
            <Typography
              component="label"
              endDecorator={ <Switch checked={hurrLayers[0].state.visible} onChange={toggleHurricaneLayer} /> }
            >Hurricane Track</Typography>
          )
        }

        {/* layer selection */}
        <ToggleButtonGroup
          value={currentLayerSelection}
          orientation="horizontal"
          variant="solid"
          color="primary"
          onChange={layerChange}
        >
          { // have to do wierd stuff to get maxele first and default button
            maxele_layer && (
              <IconButton
                value={maxele_layer.properties.product_type}
                key={Math.random()}
              >
                { layerIcons[maxele_layer.properties.product_type] }
              </IconButton>
            )
          }
          {
            topLayers
              .filter(layer => layer.properties.product_type !== "obs" && layer.properties.product_type !== "maxele63")
              .map((layer, index) => (
                <IconButton
                  key={Math.random() + index}
                  value={layer.properties.product_type}
                >
                  { layerIcons[layer.properties.product_type] }
                </IconButton>
              ))
          }
        </ToggleButtonGroup>
      </Stack>
      </AccordionDetails>
    </Accordion>
  );
};