import React, {Fragment} from 'react';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Typography, List,  ListItem, ListItemDecorator, Divider }
        from '@mui/joy';

import {
        // sidebar icons
        Layers as LayersIcon, Storm as HurricaneIcon, Checklist as ModelSelectionIcon, DeleteForever as RemoveIcon, Tune as SettingsIcon,
        Share as ShareViewIcon, HelpCenter as HelpAboutIcon,

        // map model layer types
        Tsunami as WaveHeightIcon, QueryStats as ObservationIcon, Air as WindVelocityIcon, Water as WaterLevelIcon, BlurOn as WaterSurfaceIcon,
        Flood as FloodIcon,

        // action buttons
        Map as MapIcon, LightMode as LightModeIcon, DragHandleRounded as HandleIcon, KeyboardArrowDown as ExpandIcon, ArrowDropUp as MoveUpArrow,
        KeyboardArrowLeft, ToggleOn as OnOffIcon
    } from '@mui/icons-material';

import SvgIcon from '@mui/material/SvgIcon';

/**
 * gets a svg component for the observation point icon.
 *
 * @param color
 * @param name
 * @returns {JSX.Element}
 */
const getObsSVGIcon = ( color, name ) => {
    return (
        <Fragment>
            <SvgIcon>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="black"
                >
                    <circle r="6" cx="12" cy="12" fill={ color } stroke="black" strokeWidth="1"/>
                </svg>
            </SvgIcon>
            <Typography sx={{ ml: 2, fontSize: "sm"}}> {name} </Typography>
        </Fragment>
    );

};

/**
 * This component renders the help/about tray
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpAboutTray = () => {
    // used to collapse other open accordions
    const [index, setIndex] = React.useState(0);
    const [descriptionIndex, setDescriptionIndex] = React.useState(-1);
    const [screenCapIndex, setScreenCapIndex] = React.useState(-1);

    // render the form
    return (
        <Fragment>
            <Stack gap={ 3 }>
                <AccordionGroup sx={{ size: "md", variant: "soft" }}>
                    <Typography sx={{ fontSize: "md", fontWeight: 'bold' }}>About</Typography>

                    <Stack spacing={1}>
                        <Accordion expanded={index === 0} onChange={ (event, expanded) => { setIndex(expanded ? 0 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}> Application version </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography level="body-sm" sx={{ ml: 1 }}> Version: { process.env.REACT_APP_VERSION } </Typography>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 1} onChange={ (event, expanded) => { setIndex(expanded ? 1 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}> Application description </Typography>
                            </AccordionSummary>

                            <AccordionDetails>
                                <Typography level="body-sm" sx={{ ml: 1 }}> Welcome to the visualization component(user interface) of the ADCIRC
                                    Prediction System (APS). Here are some details about the entire application. </Typography>

                                <AccordionGroup>
                                    <Accordion expanded={ descriptionIndex === 0 } onChange={ (event, expanded) => { setDescriptionIndex(expanded ? 0 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>APS</AccordionSummary>
                                        <AccordionDetails>
                                            <Typography level="body-sm" sx={{ ml: 1 }}>APS is a collection of software layers that coordinates the
                                                application of the ADCIRC storm surge model for real-time, weather-driven predictions of coastal
                                                hazards.</Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ descriptionIndex === 1 } onChange={ (event, expanded) => { setDescriptionIndex(expanded ? 1 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>ADCIRC</AccordionSummary>
                                        <AccordionDetails>
                                            <Typography level="body-sm" sx={{ ml: 1 }}>ADvanced CIRCulation is a numerical model that solves the
                                                shallow-water equations for tides, storm surge and wind-waves, using the finite element method on
                                                linear triangular elements.</Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ descriptionIndex === 2 } onChange={ (event, expanded) => { setDescriptionIndex(expanded ? 2 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>ECFLOW</AccordionSummary>
                                        <AccordionDetails>
                                            <Typography level="body-sm" sx={{ ml: 1 }}>ECFLOW is a workflow management system used to orchestrate
                                                ADCIRC simulations on HPC resources for real-time predictions of coastal hazards.</Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ descriptionIndex === 3 } onChange={ (event, expanded) => { setDescriptionIndex(expanded ? 3 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>APSViz</AccordionSummary>
                                        <AccordionDetails>
                                            <Typography level="body-sm" sx={{ ml: 1 }}>ADCIRC Prediction System Visualization (APSViz) is the workflow
                                                that coordinates post-processing of ADCIRC/ECFLOW output into geospatial formats (primarily GeoTIFF)
                                                for downstream uses. It enables the rapid and efficient visualization of APS model output that is
                                                critical for real-time decision makers facing threats from coastal flooding, high winds and wave
                                                impacts.
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ descriptionIndex === 4 } onChange={ (event, expanded) => { setDescriptionIndex(expanded ? 4 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>APSViz User Interface</AccordionSummary>
                                        <AccordionDetails>
                                            <Typography level="body-sm" sx={{ ml: 1 }}>The APSViz User interface renders the products of the APSViz
                                                workflows for the user. It provides the user with tools to select, interrogate and display various
                                                ADCIRC products.</Typography>
                                        </AccordionDetails>
                                    </Accordion>

                                </AccordionGroup>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                 </AccordionGroup>
            </Stack>

            <Stack>
                <AccordionGroup sx={{ size: "sm", variant: "soft" }}>
                    <Typography sx={{ fontSize: "md", fontWeight: 'bold' }}>FAQs</Typography>
                    <Stack spacing={1}>

                        <Accordion expanded={index === 2} onChange={ (event, expanded) => { setIndex(expanded ? 2 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>What are some features of this application?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                    <ListItem>Search for and select tropical or synoptic model runs.</ListItem>
                                    <ListItem>Display tropical hurricane tracks and cones of uncertainty.</ListItem>
                                    <ListItem>Cycle through tropical advisories or synoptic model runs.</ListItem>
                                    <ListItem>Display (or hide) various model layer products such as wind speed, wave height, water levels, etc.</ListItem>
                                    <ListItem>Select observation points to display current and forecast timeseries data at a location.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 3} onChange={ (event, expanded) => { setIndex(expanded ? 3 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>What do all the icons mean?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>

                                <Typography level="body-sm" sx={{ ml: 1, mb: 1}}>Each icon represents a functionality of the application available to the
                                    user.</Typography>
                                <Divider/>
                                <List sx={{ ml: 2, mt: 1, fontSize: "sm" }}> <Typography sx={{ fontSize: "sm", fontStyle: 'italic' }}>Collapsable tray items:</Typography>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><LayersIcon color="primary"/></ListItemDecorator>Model run/layers selected list</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><HurricaneIcon color="primary"/></ListItemDecorator>Hurricane track list</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><ModelSelectionIcon color="primary"/></ListItemDecorator>Model run filtering and selection</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><RemoveIcon color="primary"/></ListItemDecorator>Remove various map items</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><SettingsIcon color="primary"/></ListItemDecorator>Application settings</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><ShareViewIcon color="primary"/></ListItemDecorator>Share your view with a colleague</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><HelpAboutIcon color="primary"/></ListItemDecorator>Application help/about</ListItem>
                                </List>
                                <Divider/>
                                <List sx={{ ml: 2, mt: 1, fontSize: "sm" }}> <Typography sx={{ fontSize: "sm", fontStyle: 'italic' }}>Map model layer types:</Typography>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><WaveHeightIcon color="primary"/></ListItemDecorator>Maximum Significant Wave Height</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><ObservationIcon color="primary"/></ListItemDecorator>Observations</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><WindVelocityIcon color="primary"/></ListItemDecorator>Maximum Wind Speed</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><WaterLevelIcon color="primary"/></ListItemDecorator>Maximum Water Level</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><WaterSurfaceIcon color="primary"/></ListItemDecorator>HECRAS Water Surface</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><FloodIcon color="primary"/></ListItemDecorator>Inundation</ListItem>
                                </List>
                                <Divider/>
                                <List sx={{ ml: 2, mt: 1, fontSize: "sm" }}> <Typography sx={{ fontSize: "sm", fontStyle: 'italic' }}>Map observation points:</Typography>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator>{ getObsSVGIcon('#FFFF00', 'NOAA/NDBC') }</ListItemDecorator></ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator>{ getObsSVGIcon('#3D4849', 'NCEM') }</ListItemDecorator></ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator>{ getObsSVGIcon('#BEAEFA', 'NOAA/NOS') }</ListItemDecorator></ListItem>
                                </List>
                                <Divider/>
                                <List sx={{ ml: 2, mt: 1, fontSize: "sm" }}> <Typography sx={{ fontSize: "sm", fontStyle: 'italic' }}>Action buttons:</Typography>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><LightModeIcon/></ListItemDecorator>Toggle light or dark mode.</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><MapIcon/></ListItemDecorator>Select a different base map.</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><HandleIcon/></ListItemDecorator>Reorder a model run up or down in the list.</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><OnOffIcon color="primary"/></ListItemDecorator>Turn on/off a layer</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><RemoveIcon sx={{ color:'darkred', 'filter': 'opacity(0.5)' }}/></ListItemDecorator>Remove a model run or layer.</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><ExpandIcon/> or <ExpandIcon sx={{ transform: 'rotate(180deg)' }}/>Expand or collapse an item.</ListItemDecorator></ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><MoveUpArrow/> or <MoveUpArrow sx={{ transform: 'rotate(180deg)'}}/>Reorder a model layer.</ListItemDecorator></ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><KeyboardArrowLeft/> or <KeyboardArrowLeft sx={{ transform: 'rotate(180deg)'}}/>Move through tropical advisories or synoptic cycles.</ListItemDecorator></ListItem>
                              </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 4} onChange={ (event, expanded) => { setIndex(expanded ? 4 : null); }}>
                            <AccordionSummary> <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I capture a screenshot?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <AccordionGroup>
                                    <Accordion expanded={ screenCapIndex === 0 } onChange={ (event, expanded) => { setScreenCapIndex(expanded ? 0 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>Chrome</AccordionSummary>
                                        <AccordionDetails>
                                            <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                                <ListItem>Install and activate the Chrome Full Page Screen Capture browser extension.</ListItem>
                                                <ListItem>A small camera icon will appear in the top right corner of the browser.</ListItem>
                                                <ListItem>Click the camera icon.</ListItem>
                                                <ListItem>Click the “download image” icon and the image will be saved to the Downloads folder.</ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ screenCapIndex === 5 } onChange={ (event, expanded) => { setScreenCapIndex(expanded ? 5 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>Edge</AccordionSummary>
                                        <AccordionDetails>
                                            <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                                <ListItem>Right click the browser surface.</ListItem>
                                                <ListItem>Select `Screenshot` from the context menu that appears.</ListItem>
                                                <ListItem>At the top of the browser you can select to capture a portion of the browser or the entire
                                                    browser surface.</ListItem>
                                                <ListItem>A dialog of the screenshot will appear where you can save it to the Downloads folder or
                                                    the cut/paste buffer. </ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ screenCapIndex === 6 } onChange={ (event, expanded) => { setScreenCapIndex(expanded ? 6 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>Firefox</AccordionSummary>
                                        <AccordionDetails>
                                            <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                                <ListItem>Right click the browser surface</ListItem>
                                                <ListItem>Select `Take screenshot` from the context menu that appears</ListItem>
                                                <ListItem>At the top of the browser you can select to capture the visible portion of the browser or
                                                    the entire browser surface.</ListItem>
                                                <ListItem>A dialog of the screenshot will appear where you can save it to the Downloads folder or
                                                    the cut/paste buffer.</ListItem>
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>

                                    <Accordion expanded={ screenCapIndex === 7 } onChange={ (event, expanded) => { setScreenCapIndex(expanded ? 7 : null); }}>
                                        <AccordionSummary sx={{ fontSize: "sm", fontStyle: 'italic' }}>Safari</AccordionSummary>
                                        <AccordionDetails>
                                            <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                                <ListItem>Install and activate Awesome Screenshot</ListItem>
                                                <ListItem>Navigate to the target page in Safari</ListItem>
                                                <ListItem>Click the Awesome Screenshot icon (looks like a tiny camera lens) to the left of the Safari
                                                    address bar</ListItem>
                                                <ListItem>Click “Capture entire page.” An image opens in a new tab.</ListItem>
                                                <ListItem>Click the “Done” button.</ListItem>
                                                <ListItem>Follow the directions to save the file.</ListItem>
                                            </List>
                                    </AccordionDetails>
                                    </Accordion>
                                </AccordionGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 8} onChange={ (event, expanded) => { setIndex(expanded ? 8 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I add/remove/move ADCIRC model runs on the map?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><ModelSelectionIcon/></ListItemDecorator>The Model selection button.</ListItem>
                                </List>
                                <List marker="decimal" sx={{ ml: 2, fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}>Click on the ADCIRC Model selection icon.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Select either tropical or synoptic model runs.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Select one or more appropriate data filter parameters.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Click on the Submit button to retrieve model runs.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Select on the model runs returned from the query to place them on the map surface.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>When finished, retract the tray or click the Reset button to start a new search.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 9} onChange={ (event, expanded) => { setIndex(expanded ? 9 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I include, remove or reorder Layers on the map?
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><LayersIcon/></ListItemDecorator>The Model layers button.</ListItem>
                                </List>
                                <List marker="decimal" sx={{ ml: 2, fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}>Click on the Model Layers icon button.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Expand a model run.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>You can show/hide (slider), remove or reorder
                                        (up/down arrows) for individual model run layers from the list shown.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 10} onChange={ (event, expanded) => { setIndex(expanded ? 10 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I walk through synoptic cycles
                                    or hurricane advisories?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List marker="decimal" sx={{ ml: 1, fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}>Note the In the control panel in the lower left corner of the application.</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Click the left or right buttons to increment/decrement though synoptic cycles or
                                        tropical advisories.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 11} onChange={ (event, expanded) => { setIndex(expanded ? 11 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>What are some user settings?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><SettingsIcon/></ListItemDecorator>The Application Settings button.</ListItem>
                                </List>
                                <List marker="decimal" sx={{ ml: 2, fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><LightModeIcon/></ListItemDecorator>Is for selecting light or dark
                                        mode.</ListItem>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><MapIcon/></ListItemDecorator>Is for selecting a different base
                                        map.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 12} onChange={ (event, expanded) => { setIndex(expanded ? 12 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I change the base map?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List sx={{ fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}><ListItemDecorator><SettingsIcon/></ListItemDecorator>The Application Settings button.</ListItem>
                                </List>
                                <List marker="decimal" sx={{ ml: 2, fontSize: "sm" }}>
                                    <ListItem sx={{ ml: 1 }}>Click on the Application Settings icon</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Click on the base map icon</ListItem>
                                    <ListItem sx={{ ml: 1 }}>Select your preferred base map.</ListItem>
                                </List>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 13} onChange={ (event, expanded) => { setIndex(expanded ? 13 : null); }}>
                            <AccordionSummary>
                                <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>How do I view observation data?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography level="body-sm" sx={{ ml: 1 }}>All one has to do is select the colored/round icons on the map. When you
                                    do, a dialog/chart will appear that displays the time-sequenced information at that observation point.</Typography>
                            </AccordionDetails>
                        </Accordion>
                    </Stack>
                </AccordionGroup>
            </Stack>
        </Fragment>
    );
};
