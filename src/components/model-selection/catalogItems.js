import React, {Fragment, useState} from "react";
import PropTypes from 'prop-types';
import {AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack} from '@mui/joy';

/**
 * returns a list of drop down options for that data/type.
 *
 * @param data
 * @param type
 * @constructor
 */
export default function CatalogItems(data) {
    // set component prop types
    CatalogItems.propTypes = { data: PropTypes.any };

    // create some state for what catalog accordian is expanded/not expanded
    const [accordianIndex, setAccordianIndex] = useState(-1);

    // do not render if there is no data
    if (data.data != null) {
        // if there is a warning getting the result
        if (data.data['Warning'] !== undefined) {
            return (
                <div>
                    Warning: {data.data['Warning']}
                </div>
            );
        }
        // if there is an error getting the result
        else if(data.data['Error'] !== undefined) {
            return (
                <div>
                    Error: {data.data['Error']}
                </div>
            );
        }
        // return all the data cards
        else {
            return (
                <Fragment>
                    <AccordionGroup sx={{maxWidth: 415, size: "sm", variant: "soft"}}>
                        {
                            data
                                .data['catalog']
                                .filter(catalogs => catalogs !== "")
                                .map((catalog, itemIndex) =>
                                (
                                    <Stack key={ itemIndex } spacing={1}>
                                        <Accordion
                                            key={ itemIndex }
                                            sx={{ p: 0 }}
                                            expanded={accordianIndex === itemIndex}
                                            onChange={(event, expanded) => {
                                                setAccordianIndex(expanded ? itemIndex : null);
                                            }}>

                                            <AccordionSummary>
                                                Date: {catalog['id']}
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                {catalog['members'].map((member, memberIndex) => (
                                                    <Stack key={ memberIndex }>
                                                         {member['id'] }
                                                    </Stack>
                                                ))}
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                )
                            )
                        }
                    </AccordionGroup>
                </Fragment>
            );
        }
    }
}