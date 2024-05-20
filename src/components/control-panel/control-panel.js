import React, { useEffect } from 'react';
import axios from 'axios';
import { useLayers } from '@context/map-context';
import { useQuery } from '@tanstack/react-query';
import { Sheet, Typography, IconButton, Box, Switch, ToggleButtonGroup } from '@mui/joy';
import { KeyboardArrowLeft, KeyboardArrowRight, Tsunami, Water, Air, Flood } from '@mui/icons-material';
import apsLogo from '@images/aps-trans-logo.png';


export const ControlPanel = () => {

  //const { defaultModelLayers, setDefaultModelLayers, toggleLayerVisibility, makeAllLayersInvisible } = useLayers();
  const { defaultModelLayers, setDefaultModelLayers, toggleLayerVisibility } = useLayers();

  const data_url = `${process.env.REACT_APP_UI_DATA_URL}get_ui_data?limit=1&use_v3_sp=true`;
  //const gs_wms_url = `${process.env.REACT_APP_GS_DATA_URL}wms`;

  const layers = [...defaultModelLayers];
  const maxele_layer = layers.find((layer) => layer.properties.product_type === "maxele63");
  const obs_layer = layers.find((layer) => layer.properties.product_type === "obs");

  const [value, setValue] = React.useState('maxele63');
  const [checked, setChecked] = React.useState(true);

   // keep track of which model run to retrieve
  const [ runCycle, setRunCycle] = React.useState(0);
  const [ runDate, setRunDate] = React.useState("");
  const [ instanceName, setInstanceName] = React.useState("");
  const [ metClass, setMetClass] = React.useState("");
  const [ eventType, setEventType] = React.useState("");
  const [ topLayers, setTopLayers ] = React.useState([]);

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
  
    if (['obs', value].includes(product_type)) {
      return ({
        visible: true,
      });
    }
  
    return ({
      visible: false,
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
        //makeAllLayersInvisible();
        setTopLayers([...newLayers]);
        setDefaultModelLayers([...newLayers, ...defaultModelLayers]);
    }
  };

  // useQuery function
  const setNewLayers = async() => {
    // retrieve the set of layers for the new cycle
    const { isError, data, error } = await axios.get(data_url, {params: filters});

    if (isError) {
        alert(error);
    } else {}
        // add data returned to default layers, if they are not already there.
        parseAndAddLayers(data);

    return(data);
  };
  useQuery( {queryKey: ['apsviz-data', filters], queryFn: setNewLayers, enabled: !!filters});


  const date2String = (date) => {
    const str = date.getFullYear() +  
                '-' + String(date.getMonth() + 1).padStart(2, '0') +
                '-' + String(date.getDate()).padStart(2, '0');

    return str;
  };

  const string2Date = (str) => {
    const dateParts = str.split('-');
    const newDate = new Date(dateParts[0], dateParts[1]-1, dateParts[2]);

    return newDate;
  };

  // set initial values the currently display layers
  useEffect(() => {
    if ((layers[0]) && (!initialDataFetched)) {
        setInstanceName(layers[0].properties.instance_name);
        setMetClass(layers[0].properties.met_class);
        setEventType(layers[0].properties.event_type);

        setRunCycle(parseInt(layers[0].properties.cycle));
        setRunDate(layers[0].properties.run_date);
        setInitialDataFetched(true);
        setTopLayers([...defaultModelLayers]);
     }

  }, [layers]);

  // switch to the model run layer selected via icon button
  const layerChange = async (event, newValue) => {

    setValue(newValue);
     // turn off the old
     layers.map(layer => {
        if (layer.layers.includes(value)) {
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

  // switch on/off the observation layer, if it exists
  const toggleObsLayer = (event) => {
    setChecked(event.target.checked);
    toggleLayerVisibility(obs_layer.id);
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
    let currentCycle = Number(runCycle) + 0;

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
    <>
    <Sheet
        variant="plain"
        sx={{
            position: 'absolute',
            bottom: 0, right: 0,
            overflow: 'hidden',
            p: 0,
            backgroundColor: '#f0f4f800',
            height: '30vh',
            width: '300px',
            zIndex: 999,
            filter: 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.2))',
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'column',
        }}
    >
        <Box
            component="img"
            sx={{height: 70, paddingBottom: 1, alignSelf: 'center'}}
            alt="ADCIRC Prediction System"
            src={apsLogo}
        />
        { (layers.length) &&
            // <Typography level='h4' sx={{paddingLeft: 3, color: 'white'}}>model run date: {layers[0].properties.run_date}</Typography>
            <Typography level='h4' sx={{paddingLeft: 3, color: 'white'}}>model run date: {runDate}</Typography>
        }
        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginLeft: 7}}>
            <IconButton variant="outlined" button-key='previous' onClick={changeModelRunCycle}>
                <KeyboardArrowLeft/>
            </IconButton>
            {/* <Typography level='h4' sx={{ color: "white" }}>cycle {layers.length && layers[0].properties.cycle}</Typography> */}
            <Typography level='h4' sx={{ color: "white" }}>cycle {runCycle}</Typography>
            <IconButton variant="outlined" button-key='next' onClick={changeModelRunCycle}>
                <KeyboardArrowRight/>
            </IconButton>
        </Box>
        {/* TODO:  NOTE: If this is a tropical storm run, we need to change cycle to advisoy 
                    Also probabaly want to add a switch for hurricane layers - which
                    involves making a request to the MetGet API 
                    Third need to implement actual code to load different model runs each time 
                    up/down arrows are clicked. This has to time managed in some way so that
                    Geoserver is not inundated with requests */}
        { (layers.length) &&
            <Typography level='h5' sx={{ paddingLeft: 7, paddingTop: 1, color: 'white'}}>{layers[0].properties.grid_type} grid</Typography>
        }
        { ((layers.filter((layer) => layer.properties.product_type === "obs").length) > 0) &&
        <Typography sx={{ paddingLeft: 9, paddingTop: 1, color: "white" }} component="label" endDecorator={
            <Switch checked={checked} onChange={toggleObsLayer}>
        </Switch>}>
            observations
        </Typography>}
        {<Typography sx={{ paddingLeft: 9, paddingTop: 1, color: "white" }} component="label" endDecorator={<ToggleButtonGroup
                    value={value}
                    orientation="horizontal"
                    variant="solid"
                    color="primary"
                    onChange={layerChange}

                // have to do wierd stuff to get maxele first and default button
            >   { (maxele_layer)  &&
                    <IconButton value={maxele_layer.properties.product_type} key={maxele_layer.properties.id}>
                        <Water/>
                    </IconButton>
                }
                { topLayers.map(layer => {
                    if (layer.properties.product_type != "obs" && layer.properties.product_type != "maxele63")
                        
                        return (
                            <IconButton value={layer.properties.product_type} key={layer.properties.id}>
                                { (layer.properties.product_type === "maxwvel63") &&
                                <Air/>}
                                {(layer.properties.product_type === "swan_HS_max63") &&
                                <Tsunami/>}
                                {(layer.properties.product_type === "maxinundepth63") &&
                                <Flood/>}
                            </IconButton>
                        );
                })}
            </ToggleButtonGroup>}>
        </Typography>}
    </Sheet>
    </>
  );
};