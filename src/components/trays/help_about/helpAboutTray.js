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

    // render the form
    return (

        <Fragment>
            <Stack gap={ 3 }>
                <AccordionGroup sx={{size: "sm", variant: "soft"}}>
                <Typography level="title-lg"> About </Typography>
                    <Stack spacing={1}>
                        <Accordion expanded={index === 0} onChange={(event, expanded) => { setIndex(expanded ? 0 : null); }}>
                            <AccordionSummary> <Typography level="title-lg"> Application version </Typography> </AccordionSummary>
                            <AccordionDetails> Version: {process.env.REACT_APP_VERSION}</AccordionDetails>
                        </Accordion>
                        <Accordion expanded={index === 1} onChange={(event, expanded) => { setIndex(expanded ? 1 : null); }}>
                            <AccordionSummary> <Typography level="title-lg"> Application description </Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>
                    </Stack>
                 </AccordionGroup>
            </Stack>

            <Stack>
                <AccordionGroup sx={{size: "sm", variant: "soft"}}>
                    <Typography level="h4">FAQs</Typography>
                    <Stack spacing={1}>

                        <Accordion expanded={index === 3} onChange={(event, expanded) => { setIndex(expanded ? 3 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">What FAQs should we put in here?</Typography> </AccordionSummary>
                            <AccordionDetails> What sort of things should we be putting in the FAQs? Below are some examples... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 4} onChange={(event, expanded) => { setIndex(expanded ? 4 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">What are some features of this application?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 5} onChange={(event, expanded) => { setIndex(expanded ? 5 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I add/remove Layers on the map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 6} onChange={(event, expanded) => { setIndex(expanded ? 6 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I move through synoptic cycles?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 7} onChange={(event, expanded) => { setIndex(expanded ? 7 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">What do the icons on the left mean?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 8} onChange={(event, expanded) => { setIndex(expanded ? 8 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">What are some user settings?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 9} onChange={(event, expanded) => { setIndex(expanded ? 9 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I change the base map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 10} onChange={(event, expanded) => { setIndex(expanded ? 10 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I view observation data?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 11} onChange={(event, expanded) => { setIndex(expanded ? 11 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I show/hide layers?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                        <Accordion expanded={index === 12} onChange={(event, expanded) => { setIndex(expanded ? 12 : null); }}>
                            <AccordionSummary> <Typography level="title-lg">How do I reorder layers on the map?</Typography> </AccordionSummary>
                            <AccordionDetails> Add some content here... </AccordionDetails>
                        </Accordion>

                    </Stack>
                </AccordionGroup>
            </Stack>
        </Fragment>
    );
};
