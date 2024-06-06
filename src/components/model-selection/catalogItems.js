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

    // variables for the data display
    let typeName = null;
    let typeEle = null;
    let modelName = null;
    let modelEle = null;
    let numberName = null;
    let numberEle = null;

    // do not render if there is no data
    if (data.data != null) {
        // if there was a warning getting the result
        if (data.data['Warning'] !== undefined) {
            return (
                <div>
                    Warning: {data.data['Warning']}
                </div>
            );
        }
        // if there was an error getting the result
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
            if (data.isTropical) {
                typeName = 'Storm: ';
                typeEle = 'storm_name';
                // modelName = 'Model: ';
                // modelElement = 'meteorological_model';
                numberName = ' Advisory: ';
                numberEle = 'advisory_number';
            }
            else if (!data.isTropical) {
                modelName = 'Model: ';
                modelEle = 'model';
                numberName = ' Cycle: ';
                numberEle = 'cycle';
            }

            // render the results of the data query
            return (
                <Fragment>
                    <AccordionGroup sx={{ maxWidth: 415, size: "sm", variant: "soft" }}>
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
                                            }}>
                                            <AccordionSummary>
                                                {catalog['id']}
                                            </AccordionSummary>

                                            <AccordionDetails> {
                                                // loop through the data members and put them away
                                                catalog['members']
                                                    // filter by the group name
                                                    .filter((val, idx, self) => (
                                                        idx === self.findIndex((t)=> (
                                                            t['group'] === val['group']))))
                                                    // output summarized details of each group member
                                                    .map((mbr, mbrIdx) => (
                                                        // create the checkbox
                                                        <Checkbox
                                                            sx={{ m: .5 }}
                                                            key={ mbrIdx }
                                                            label={
                                                                ((typeName) ? typeName + mbr['properties'][typeEle].toUpperCase() + ', ' : '') +
                                                                ((modelName) ? modelName + mbr['properties'][modelEle].toUpperCase() + ', ' : '') +
                                                                numberName + mbr['properties'][numberEle]
                                                                // + ', Grid: ' + member['properties']['grid_type']
                                                            }
                                                        />
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