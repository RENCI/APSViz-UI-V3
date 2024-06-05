import React, {Fragment, useState} from "react";
import PropTypes from 'prop-types';
import {AccordionGroup, Accordion, AccordionSummary, AccordionDetails, Stack, Checkbox} from '@mui/joy';

// set component prop types
CatalogItems.propTypes = { data: PropTypes.any};

/**
 * returns a list of drop down options for that data/type.
 *
 * @param data
 * @param type
 * @constructor
 */
export default function CatalogItems(data) {
    // create some state for what catalog accordian is expanded/not expanded
    const [accordianDateIndex, setAccordianDateIndex] = useState(-1);

    // variables for the met-class type data
    let numberName = '';
    let numberElement = '';

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
            // save the name of the element for advisory or cycle numbers
            if (data.isTropical === true) {
                numberName = ' Advisory: ';
                numberElement = 'advisory_number';
            }
            else if (data.isTropical === false) {
                numberName = ' Cycle: ';
                numberElement = 'cycle';
            }

            return (
                <Fragment>
                    <AccordionGroup sx={{maxWidth: 415, size: "sm", variant: "soft"}}>
                        {
                            data.data['catalog']
                            .filter(catalogs => catalogs !== "")
                            .map(
                                (catalog, itemIndex) =>
                                (
                                    <Stack key={ itemIndex } spacing={ 1 }>
                                        <Accordion
                                            key={ itemIndex }
                                            sx={{ p: 0 }}
                                            expanded={accordianDateIndex === itemIndex}
                                            onChange={(event, expanded) => {
                                                setAccordianDateIndex(expanded ? itemIndex : null);
                                            }}
                                        >
                                            <AccordionSummary>
                                                {catalog['id']}
                                            </AccordionSummary>

                                            <AccordionDetails>
                                                { catalog['members']
                                                    .filter((val, idx, self) => (
                                                        idx === self.findIndex((t)=> (
                                                            t['group'] === val['group']))))
                                                    .map((member, memberIndex) => (
                                                        <Checkbox sx={{ m: .5 }} key={ memberIndex } label={ numberName + member['properties'][numberElement] + ' (' + member['properties']['grid_type'] + ')' }/>
                                                    ))
                                                }
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