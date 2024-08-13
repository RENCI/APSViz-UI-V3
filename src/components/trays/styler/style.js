import React, { useEffect } from 'react';
import { Stack } from '@mui/joy';
//import { Style } from 'geostyler';
import { ColorMapEditor } from 'geostyler';
import SldStyleParser from 'geostyler-sld-parser';
import { maxeleStyle } from './default-styles';
import { DataRangeEdit } from './data-range';

/**
 * component that renders the help/about tray.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Styler = () => {
      const [theColorMap, setTheColorMap] = React.useState();

      const sldParser = new SldStyleParser();

      const handleColorMapChange = (event, colorMap) => {
        console.log(colorMap);
      };
    
      useEffect(() => {
        sldParser
          .readStyle(maxeleStyle)
          .then((geostylerStyle) => {
            setTheColorMap(geostylerStyle.output.rules[0].symbolizers[0].colorMap);
          })
          .catch(error => console.log(error));
      }, []);
    
      return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={10}
        >
              <DataRangeEdit />
              {/* <ColorMapEditor
                colorMap={theColorMap}
                onChange={handleColorMapChange}
              /> */}
        </Stack>
    );
};