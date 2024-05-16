import React, { Fragment } from 'react';
import {Button, Input, Stack, Tabs, TabList, Tab, TabPanel, Divider} from '@mui/joy';
import { useLayers } from "@context";

// import {LayerCard} from "@components/trays/layers/layer-card";

/**
 * This component renders the layer selection form
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ModelSelectionForm = () => {
    // get references to the filtered layer state
    const {
        //filteredModelLayers
    } = useLayers();

    // render the form
    return (
        <Fragment>
            <Tabs aria-label="Type tabs" defaultValue={0}>
                <TabList>
                    <Tab>Tropical</Tab>
                    <Tab>Synoptic</Tab>
                </TabList>
                <TabPanel value={0}>
                    <form onSubmit = { formHandler }>
                        <Stack spacing={1}>
                            <Input name="tropical-storm-name" placeholder="Tropical storm name control" />
                            <Input name="tropical-advisory" placeholder="Tropical advisory control" />
                            <Input name="tropical-grid" placeholder="Tropical grid control" />
                            <Input name="tropical-instance" placeholder="Tropical instance control" />

                            <Button type="submit">Submit</Button>
                            <Button type="reset">Reset</Button>
                        </Stack>

                        <Divider sx={{m: 2}} />

                        <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
                            {/* list of search results goes here
                                may be able to leverage trays/layers/layer-card />
                            */}
                        </Stack>
                    </form>
                </TabPanel>
                <TabPanel value={1}>
                    <form onSubmit={ formHandler }>
                        <Stack spacing={1}>
                            <Input name="synoptic-date" placeholder="Synoptic date control" />
                            <Input name="synoptic-cycle" placeholder="Synoptic cycle control" />
                            <Input name="synoptic-grid" placeholder="Synoptic grid control" />
                            <Input name="synoptic-instance" placeholder="Synoptic instance control" />

                            <Button type="submit">Submit</Button>
                            <Button type="reset">Reset</Button>
                        </Stack>

                        <Divider sx={{m: 2}} />

                        <Stack sx={{ maxHeight: "400px", overflow: "auto" }}>
                            {/* list of search results goes here
                                may be able to leverage trays/layers/layer-card />
                            */}
                        </Stack>
                    </form>
                </TabPanel>
            </Tabs>
        </Fragment>
    );
};

/**
 * this method populates the controls on the form.
 *
 */
// const dataLoader = () => {
//
// };

/**
 * method to initiate a model search with the filter selections on the form
 *
 * @param event
 */
const formHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formJson));
};