import React, { Fragment, useState } from 'react';
import { Stack, Typography, Switch, Divider, Button, Card } from '@mui/joy';
import { useLayers } from '@context';
import { CompareArrows as CompareLayersIcon, Tsunami as WaveHeightIcon, QueryStats as ObservationIcon,
        Air as WindVelocityIcon, Water as WaterLevelIcon, BlurOn as WaterSurfaceIcon, Flood as FloodIcon }
    from '@mui/icons-material';

/**
 * This component renders the model selection tray
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const CompareLayersTray = () => {
    // get the context for the compare layers view
    const {
        showCompareLayers,
        toggleCompareLayersView,
        defaultModelLayers
    } = useLayers();

    const defaultPlaceholder = 'Not Selected';

    // create some state for the left/right name selections
    const [leftPaneName, setLeftPaneName] = useState(defaultPlaceholder);
    const [rightPaneName, setRightPaneName] = useState(defaultPlaceholder);

    // create some state for the left/right ID selections
    const [leftPaneID, setLeftPaneID] = useState('');
    const [rightPaneID, setRightPaneID] = useState('');

    /**
     * Save the layer info to state
     *
     * @param paneType
     * @param paneID
     * @param paneName
     */
    const setPaneInfo = (paneType, paneID, paneName) => {
        // save the ID and name of the left pane layer selection
        if (paneType === 'left') {
            // set the layer name
            setLeftPaneName(paneName);

            // set the layer id
            setLeftPaneID(paneID);
        }
        // save the ID and name of the right pane layer selection
        else {
            // set the layer name
            setRightPaneName(paneName);

            // set the layer id
            setRightPaneID(paneID);
        }
    };

    const getLayerIcon = ( layerType )=> {
        switch ( layerType ) {
            default:
                return <WaveHeightIcon/>;
        }
    };

    // render the controls
    return (
        <Fragment>
            <Stack direction="column" gap={ 1 }>
                <Stack direction="row" alignItems="center" gap={ 1 }>
                    <Switch id="compare-layers" size="sm" checked={ showCompareLayers } onChange={ toggleCompareLayersView } />
                    <Typography level="body-sm">{ (defaultModelLayers.length > 0) ? defaultModelLayers[0]['group'] : '' } layer compare.</Typography>
                </Stack>

                <Divider/>

                {
                    // if we are in compare mode
                    ( showCompareLayers ) ?
                        // filter/map the layers to return layers to select
                        defaultModelLayers
                            // avoid the selection of the observation layer
                            .filter(layer => layer.properties['product_type'] !== 'obs')
                            // at this point we have the layers
                            .map((layer, idx) => (
                                <Card key={ idx }>
                                    <Stack direction="row" alignItems="center" gap={ 1 }>
                                        { getLayerIcon }
                                        <Typography level="body-sm">{ layer.properties['product_name'] }</Typography>
                                    </Stack>
                                    <Stack direction="row" gap={ 4 } alignItems="center">
                                        <Button onClick={ () => setPaneInfo('left', layer.id, layer.properties['product_name']) }>Left pane</Button>
                                        <Button onClick={ () => setPaneInfo('right', layer.id, layer.properties['product_name']) }>Right pane</Button>
                                    </Stack>
                                </Card>
                            )) : ''
                }

                {
                    // if we are in compare mode
                    ( showCompareLayers ) ?
                        // show the user selections
                        ((leftPaneID || rightPaneID) ?
                            <Fragment>
                                <Typography level="body-sm">Comparing: </Typography>
                                <Stack direction={"row"}>
                                    <Typography sx={{ ml: 1, mr: .5 }} level="body-sm">{ leftPaneName } </Typography>
                                    <CompareLayersIcon/>
                                    <Typography sx={{ ml: .5 }} level="body-sm">{ rightPaneName }</Typography>
                                </Stack>
                            </Fragment> : '') : ''
                }

                {
                    // if we are in compare mode
                    ( showCompareLayers ) ?
                        // verify that the user has not selected the same item for each pane
                        (((leftPaneID === rightPaneID) && (leftPaneID && rightPaneID)) ?
                        <Typography sx={{ ml: 2, color: 'red' }} level="body-sm" >You can not have the same layer in both comparison panes.
                        </Typography> : '') : ''
                }
            </Stack>
        </Fragment>
    );
};
