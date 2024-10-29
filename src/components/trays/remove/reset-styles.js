import React, { Fragment } from 'react';
import { Button } from '@mui/joy';

/**
 * component that handles the removal of styles from
 * local storage ADCIRC raster layers
 *
 * @returns React.ReactElement
 * @constructor
 */
export const ResetStyles = () => {
    const styles = [
        'maxele',
        'maxwvel',
        'swan',
    ];

    /**
     * remove the raster layer styles from local storage
     */
    function removeStyles() {
       styles.forEach((style) => window.localStorage.removeItem(style));
    }

    // render the button
    return (
        <Fragment>
            <Button color="primary" onClick={() => removeStyles()}>Reset ADCIRC Layers Colormaps</Button>
        </Fragment>
  );
};
