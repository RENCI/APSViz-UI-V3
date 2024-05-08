import React, { Fragment } from 'react';
import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import {Tabs, TabList, Tab, TabPanel} from '@mui/joy';

import { useLayers } from "@context";
import CssBaseline from '@mui/material/CssBaseline';

/**
 * This component renders the layer selection form
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const LayerSelectionForm = () => {
    // get references to the filtered layer state
    const {
        //filteredModelLayers
    } = useLayers();

    // render the form
    return (
        <Fragment>
            <CssBaseline />
            <Tabs aria-label="Type tabs" defaultValue={0}>
                <TabList>
                    <Tab>Tropical</Tab>
                    <Tab>Synoptic</Tab>
                </TabList>
                <TabPanel value={0}>
                    <form onSubmit = { formHandler }>
                        <Stack spacing={1}>
                            <Input name="tropical" placeholder="Tropical tab control" required />
                            <Button type="submit">Submit</Button>
                        </Stack>
                    </form>
                </TabPanel>
                <TabPanel value={1}>
                    <form onSubmit={ formHandler }>
                        <Stack spacing={1}>
                            <Input name="synoptic" placeholder="Synoptic tab control" required />
                            <Button type="submit">Submit</Button>
                        </Stack>
                    </form>
                </TabPanel>
            </Tabs>
        </Fragment>
    );
};

const formHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const formJson = Object.fromEntries(formData.entries());
        alert(JSON.stringify(formJson));
};