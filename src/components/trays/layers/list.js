import React from 'react';
import {
  AccordionGroup, Box,
  Divider, Accordion, AccordionSummary, AccordionDetails
} from '@mui/joy';
import { useLayers } from '@context';
import { LayerCard } from './layer-card';
import { DeleteModelRunButton } from "@components/trays/layers/delete-layer-button";

/**
 * gets the header data property name index
 * This takes into account the two types of runs (tropical, synoptic)
 *
 * @param layerProps
 * @param type
 * @returns {string}
 */
const getPropertyName = (layerProps, type) => {
  // init the return
  let ret_val = undefined;

  // capture the name of the element for tropical storms and advisory numbers
  if (layerProps['met_class'] === 'tropical') {
    switch (type) {
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
    switch (type) {
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
const getHeaderSummary = (layerProps) => {
  // get the full accordian summary text
  return layerProps['run_date'] + ': ' +
      ((getPropertyName(layerProps, 'stormOrModelEle') === undefined) ? 'Data error' : getPropertyName(layerProps, 'stormOrModelEle').toUpperCase()) +
      ', ' + getPropertyName(layerProps, 'numberName') + getPropertyName(layerProps, 'numberEle') +
      ', Type: ' + layerProps['event_type'] +
      ', Grid: ' + layerProps['grid_type'] +
      ((layerProps['meteorological_model'] === 'None') ? '' : ', ' + layerProps['meteorological_model']);
};

/**
 * renders the layer cards for a model run
 *
 * @param layers
 * @param group
 * @returns {*[]}
 */
const renderLayerCards = (layers, group) => {
    // init the return
    const layerCards = [];

    // filter/map the layers to create/return the layer card list
    layers
        // capture the layers for this group
        .filter(layer => ( layer['group'] === group) )
        // at this point we have the distinct runs
        .map((layer, idx) => {
          layerCards.push(<LayerCard key={`layer-${ idx }`} layer={ layer } index={ idx }> </LayerCard>);
    });

    // return to the caller
    return layerCards;
};

/**
 * collect the list of unique layer groups
 *
 * @param layers
 * @returns {*[]}
 */
const getGroupList = (layers) => {
  // init the group list
  const groupList = [];

  // loop through the layers and get the unique groups
  layers
    // filter by the group name
    .filter((groups, idx, self) =>
      ( idx === self.findIndex((t)=> ( t['group'] === groups['group']) )))
    // .sort((a, b) =>
    //     a['run_date'] < b['run_date'] ? 1 : -1)
    // at this point we have the distinct runs
    .map((layer) => {
      groupList.push(layer);
    });

  // return the list of groups
  return groupList;
};

/**
 * render the layers for the selected run groups
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const LayersList = () => {
  // get a handle to the layer state
  const { defaultModelLayers } = useLayers();

  // get the default layers
  const layers = [...defaultModelLayers];

  // get the unique groups in the selected run groups
  const groupList = getGroupList(layers);

  // loop through the layers and put them away
  return (
    <AccordionGroup variant="soft">
      {
        // loop through the layer groups and put them away
        groupList
          // filter by the group name
          .filter((groups, idx, self) =>
            ( idx === self.findIndex((t)=> ( t['group'] === groups['group']) )))
          // at this point we have the distinct runs
          .map((groups, idx) => {
            return (
              <Accordion key={idx}>
                <Box sx={{ display: "flex" }}>
                  <DeleteModelRunButton groupId={ groups['group'] } />
                  <Box>
                    <AccordionSummary sx={{ fontSize: 12 }}>{ getHeaderSummary(groups['properties']) } </AccordionSummary>
                  </Box>
                </Box>

                <AccordionDetails>
                  { renderLayerCards( layers, groups['group'] ) }
                </AccordionDetails>
              </Accordion>
            );
          })
      }
      <Divider />
    </AccordionGroup>
  );
};

