import React from 'react';
import {
  Box,
  Stack,
} from '@mui/joy';
import apsLogo from '@images/aps-trans-logo.png';
import noppLogo from '@images/nopp-logo.png';
import { getBrandingHandler } from "@utils/map-utils";


export const Branding = () => {

    // get the branded website if any
    let product_code = getBrandingHandler();
    // for testing: let product_code = '&project_code=nopp';
    if (product_code) {
        product_code = product_code.split('=')[1];
    }

    return (
        <div>
        {product_code === "nopp" ?
            ( <Stack direction="row" gap={ 1 } alignItems="center">
                <Box
                    component="img"
                    width="100px"
                    alt="ADCIRC Prediction System"
                    src={noppLogo}
                    />
                <Box
                    component="img"
                    width="150px"
                    alt="ADCIRC Prediction System"
                    src={apsLogo}
            />
            </Stack>) :
            ( <Stack direction="column" gap={ 1 } alignItems="center">
            <Box
                component="img"
                width="250px"
                alt="ADCIRC Prediction System"
                src={apsLogo}
            />
        </Stack>)
        }
        </div>
    );
};
