import React, {Fragment} from 'react';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Typography } from '@mui/joy';
/**
 * This component renders the help/about try
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpAboutTray = () => {
    // used to collapse other open accordions
    const [index, setIndex] = React.useState(0);
    const [subIndex, setSubIndex] = React.useState(-1);

    // render the form
    return (
        <Fragment>
            <Stack gap={ 3 }>
                <AccordionGroup sx={{ size: "sm", variant: "soft" }}>
                <Typography level="title-lg"> About </Typography>
                    <Stack spacing={1}>
                        <Accordion expanded={index === 0} onChange={ (event, expanded) => { setIndex(expanded ? 0 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}> Application version </Typography> </AccordionSummary>
                            <AccordionDetails> Version: { process.env.REACT_APP_VERSION }</AccordionDetails>
                        </Accordion>
                        <Accordion expanded={index === 1} onChange={ (event, expanded) => { setIndex(expanded ? 1 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}> Application description </Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>
                    </Stack>
                 </AccordionGroup>
            </Stack>

            <Stack>
                <AccordionGroup sx={{ size: "sm", variant: "soft" }}>
                    <Typography level="h4">FAQs</Typography>
                    <Stack spacing={1}>

                        <Accordion expanded={index === 3} onChange={ (event, expanded) => { setIndex(expanded ? 3 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>What FAQs should we put in here?</Typography> </AccordionSummary>
                            <AccordionDetails> What sort of things should we be putting in the FAQs? Below are some examples... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 4} onChange={ (event, expanded) => { setIndex(expanded ? 4 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I capture a screenshot ?</Typography> </AccordionSummary>
                            <AccordionDetails>
                                <AccordionGroup>
                                    <Accordion  expanded={ subIndex === 0 } onChange={ (event, expanded) => { setSubIndex(expanded ? 0 : null); }}>
                                        <AccordionSummary sx={{fontStyle: 'italic'}}>Edge</AccordionSummary>
                                            <AccordionDetails>
                                                    <ul>
                                                        <li>Right click the browser surface.</li>
                                                        <li>Select `Screenshot` from the context menu that appears.</li>
                                                        <li>At the top of the browser you can select to capture a portion of the browser or the entire browser surface.</li>
                                                        <li>A dialog of the screenshot will appear where you can save it to the Downloads folder or the cut/paste buffer. </li>
                                                    </ul>
                                            </AccordionDetails>
                                    </Accordion>

                                    <Accordion  expanded={ subIndex === 1 } onChange={ (event, expanded) => { setSubIndex(expanded ? 1 : null); }}>
                                        <AccordionSummary sx={{ fontStyle: 'italic' }}>Firefox</AccordionSummary>
                                            <AccordionDetails>
                                                <ul>
                                                    <li>Right click the browser surface</li>
                                                    <li>Select `Take screenshot` from the context menu that appears</li>
                                                    <li>At the top of the browser you can select to capture the visible portion of the browser or the entire browser surface.</li>
                                                    <li>A dialog of the screenshot will appear where you can save it to the Downloads folder or the cut/paste buffer.</li>
                                                </ul>
                                            </AccordionDetails>
                                    </Accordion>

                                    <Accordion  expanded={ subIndex === 2 } onChange={ (event, expanded) => { setSubIndex(expanded ? 2 : null); }}>
                                        <AccordionSummary sx={{ fontStyle: 'italic' }}>Chrome</AccordionSummary>
                                            <AccordionDetails>
                                                <ul>
                                                    <li>Install and activate the Chrome Full Page Screen Capture browser extension.</li>
                                                    <li>A small camera icon will appear in the top right corner of the browser.</li>
                                                    <li>Click the camera icon.</li>
                                                    <li>Click the “download image” icon and the image will be saved to the Downloads folder.</li>
                                                </ul>
                                            </AccordionDetails>
                                    </Accordion>

                                    <Accordion  expanded={ subIndex === 3 } onChange={ (event, expanded) => { setSubIndex(expanded ? 3 : null); }}>
                                        <AccordionSummary sx={{ fontStyle: 'italic' }}>Safari</AccordionSummary>
                                            <AccordionDetails>
                                                <ul>
                                                    <li>Install and activate Awesome Screenshot</li>
                                                    <li>Navigate to the target page in Safari</li>
                                                    <li>Click the Awesome Screenshot icon (looks like a tiny camera lens) to the left of the Safari address bar</li>
                                                    <li>Click “Capture entire page.” An image opens in a new tab.</li>
                                                    <li>Click the “Done” button.</li>
                                                    <li>Follow the directions to save the file.</li>
                                                </ul>
                                        </AccordionDetails>
                                    </Accordion>
                                </AccordionGroup>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 5} onChange={ (event, expanded) => { setIndex(expanded ? 5 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>What are some features of this application?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 6} onChange={ (event, expanded) => { setIndex(expanded ? 6 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I add/remove Layers on the map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 7} onChange={ (event, expanded) => { setIndex(expanded ? 7 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I move through synoptic cycles?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 8} onChange={ (event, expanded) => { setIndex(expanded ? 8 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>What do the icons on the left mean?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 9} onChange={ (event, expanded) => { setIndex(expanded ? 9 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>What are some user settings?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 10} onChange={ (event, expanded) => { setIndex(expanded ? 10 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I change the base map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 11} onChange={ (event, expanded) => { setIndex(expanded ? 11 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I view observation data?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 12} onChange={ (event, expanded) => { setIndex(expanded ? 12 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I show/hide layers?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 13} onChange={ (event, expanded) => { setIndex(expanded ? 13 : null); }}>
                            <AccordionSummary> <Typography level="title-md" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>How do I reorder layers on the map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                    </Stack>
                </AccordionGroup>
            </Stack>
        </Fragment>
    );
};
