import React, {Fragment} from 'react';
import {Tab, Tabs, TabList, TabPanel} from '@mui/joy';
import {SynopticTabForm} from "@model-selection/synopticTab";
import {TropicalTabForm} from "@model-selection/tropicalTab";

/**
 * This component renders the layer selection form
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const ModelSelectionTray = () => {
    // render the form
    return (
        <Fragment>
            <Tabs aria-label="Type tabs" defaultValue={0}>
                <TabList>
                    <Tab>Tropical</Tab>
                    <Tab>Synoptic</Tab>
                </TabList>

                <TabPanel value={0}>
                    <TropicalTabForm/>
                </TabPanel>

                <TabPanel value={1}>
                    <SynopticTabForm/>
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
