import React, { useEffect } from 'react';
import axios from 'axios';
import { useLayers } from '@context/map-context';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
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
} from '@mui/icons-material';
import apsLogo from '@images/aps-trans-logo.png';

const layerIcons = {
  maxele63: <MaxElevationIcon />,
  maxwvel63: <MaxWindVelocityIcon />,
  swan_HS_max63: <SwanIcon />,
  maxinundepth63: <MaxInundationIcon />,
};

export const ControlPanel = () => {

  const { defaultModelLayers,
          setDefaultModelLayers,
          getAllLayersInvisible,
          toggleLayerVisibility,
          toggleHurricaneLayerVisibility } = useLayers();

  const data_url = `${process.env.REACT_APP_UI_DATA_URL}get_ui_data?limit=1&use_v3_sp=true`;
  const layers = [...defaultModelLayers];
  const maxele_layer = layers.find((layer) => layer.properties.product_type === "maxele63");
  const obs_layer = layers.find((layer) => layer.properties.product_type === "obs");

  const [currentLayerSelection, setCurrentLayerSelection] = React.useState('maxele63');
  const [checkedHurr, setCheckedHurr] = React.useState(true);

   // keep track of which model run to retrieve
  const [ runCycle, setRunCycle] = React.useState(0);
  const [ runAdvisory, setRunAdvisory] = React.useState(0);
  const [ runDate, setRunDate] = React.useState("");
  const [ instanceName, setInstanceName] = React.useState("");
  const [ metClass, setMetClass] = React.useState("");
  const [ eventType, setEventType] = React.useState("");
  const [ topLayers, setTopLayers ] = React.useState([]);

  const ll = layers.map((layer, idx) => {
    console.log(layer);
    console.log(idx);
  })
  // when cycle buttons are pushed on the control panel
  // either the previous or next cycle of the displayed 
  // adcirc model run will be displayed on the map
  // if the run is not already in memory, it will have
  // to be retrieved from the get_ui_data api
  // retrieve adcirc data and layers from filter data provided
  // then populate default layers state
  // all params are strings, and runDate format is YYYY-MM-DD
  const [filters, setFilters] = React.useState();
  const [initialDataFetched, setInitialDataFetched] = React.useState(false);

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

  const parseAndAddLayers = (d) => {

    // first see if this set of layers already exists in default layers
    if (d.catalog[0].members && defaultModelLayers.find(layer => layer.id === d.catalog[0].members[0].id)) {
        console.log("already have this one");
    }
    // if not, add these layers to default layers
    else {
        // add visibity state property to retrieved catalog layers
        const newLayers = [];
        d.catalog[0].members.forEach((layer) => {
            newLayers.push({
                ...layer,
                state: newLayerDefaultState(layer)
            });
        });
        const currentLayers = getAllLayersInvisible();
        setTopLayers([...newLayers]);
        setDefaultModelLayers([...newLayers, ...currentLayers]);
    }
  };

  // useQuery function
  const setNewLayers = async() => {
    // retrieve the set of layers for the new cycle
    const { isError, data, error } = await axios.get(data_url, {params: filters});

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

  // set initial values for the current display layers
  // also need to handle layers added or deleted outside
  // of the control panel
  useEffect(() => {
    if ((layers[0]) && (!initialDataFetched)) {
      setInstanceName(layers[0].properties.instance_name);
      setMetClass(layers[0].properties.met_class);
      setEventType(layers[0].properties.event_type);
      setRunAdvisory(layers[0].properties.advisory_number);
      setRunCycle(parseInt(layers[0].properties.cycle));
      setRunDate(layers[0].properties.run_date);
      setInitialDataFetched(true);
      setTopLayers([...defaultModelLayers]);
    }

  }, [layers]);

  // switch to the model run layer selected via icon button
  const layerChange = async (event, newValue) => {

    setCurrentLayerSelection(newValue);
     // turn off the old
     layers.map(layer => {
        if (layer.layers.includes(currentLayerSelection)) {
            toggleLayerVisibility(layer.id);
        }
    }); 
    // Yikes! need another way to do this - but it works for now
    await new Promise(r => setTimeout(r, 1));
    // turn on the new
    layers.map(layer => {
        if (layer.layers.includes(newValue)) {
            toggleLayerVisibility(layer.id);
        }
    });
  };

  // switch on/off the observation layer if it exists
  const toggleObsLayer = () => {
    toggleLayerVisibility(obs_layer.id);
  };

  // switch on/off the hurricane track layer, if it exists
  const toggleHurricaneLayer = (event) => {
    setCheckedHurr(event.target.checked);
    const layerID = obs_layer.id.substr(0, obs_layer.id.lastIndexOf("-")) + '-hurr';
    toggleHurricaneLayerVisibility(layerID);
  };

  // cycle to the next model run cycle and retrieve the
  // layers associated with that cycle/date
  const changeModelRunCycle = (e) => {

    const direction = e.currentTarget.getAttribute("button-key");

    // TODO: Need to update this to also support tropical storms
    // const runId = layers[0].id.split('-')[0];
    // const metClass = layers[0].properties.met_class;
    // const eventType = layers[0].properties.event_type;
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

    setRunDate(date2String(currentDate));
    const cycle = String(currentCycle).padStart(2, '0');
    setRunCycle(cycle);

    const newFilters = {"instance_name": instanceName,
                        "met_class": metClass,
                        "event_type": eventType,
                        "run_date": date2String(currentDate),
                        "cycle": cycle
    };

    setFilters(newFilters);
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
        zIndex: 999,
        borderRadius: 'sm',
      }}
    >
      <AccordionSummary slotProps={{buttonClasses: {size: 'xx-large'}}}>
      {/* <ExpandMoreIcon sx={{ color: 'blue', size: 'xx-large' }} /> */}
      <Stack direction="column" gap={ 1 } alignItems="center">
        <Box
          component="img"
          width="250px"
          alt="ADCIRC Prediction System"
          src={apsLogo}
        />
      </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{'marginBottom': '15px'}}>
      <Stack direciton="column" gap={ 1 } alignItems="center">
        <Divider />
        {
          layers.length && (
            <Typography level="body-md" alignSelf="center">
              Model run date: {runDate}
            </Typography>
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
          layers.some(layer => layer.properties.met_class === "tropical") && (
            <Typography
              component="label"
              endDecorator={ <Switch checked={checkedHurr} onChange={toggleHurricaneLayer} /> }
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
                key={maxele_layer.id}
              >
                { layerIcons[maxele_layer.properties.product_type] }
              </IconButton>
            )
          }
          {
            topLayers
              .filter(layer => layer.properties.product_type !== "obs" && layer.properties.product_type !== "maxele63")
              .map(layer => (
                <IconButton
                  key={layer.id}
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