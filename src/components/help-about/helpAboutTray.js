import React, {Fragment} from 'react';
import { AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Typography } from '@mui/joy';
/**
 * This component renders the help/about try
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const HelpAboutTray = () => {
    // render the form
    return (
        <Fragment>
            <Stack gap={ 2 }>
                <Typography level="title-lg">App version: {process.env.REACT_APP_VERSION}</Typography>
            </Stack>

            <Stack>
                <AccordionGroup sx={{size: "sm", variant: "soft"}}>
                    <Typography level="title-lg">FAQs</Typography>
                    <Stack spacing={1}>

                        <Accordion>
                            <AccordionSummary> What FAQs should we put in here? </AccordionSummary>
                            <AccordionDetails> What sort of things should we be putting in the FAQs? Below are some examples... </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> What are some features of this application? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I add/remove Layers on the map? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I move through synoptic cycles? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> What do the icons on the left mean? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> What are some user settings? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I change the base map? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I view observation data? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I show/hide layers without deleting them? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary> How do I reorder layers on the map? </AccordionSummary>
                            <AccordionDetails> Here are some details </AccordionDetails>
                        </Accordion>

                    </Stack>
                </AccordionGroup>
            </Stack>
        </Fragment>
    );
};
