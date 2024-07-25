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
            console.log(geostylerStyle);
            setTheColorMap(geostylerStyle.output.rules[0].symbolizers[0].colorMap);
            console.log(theColorMap);
          })
          .catch(error => console.log(error));
      }, []);
    
      return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            gap={2}
        >
                {/* <Typography level="title-md">Change range of data in colormap</Typography>

                <Box width={300} >
                    <Slider
                        getAriaLabel={() => 'Y-Axis'}
                        value={ value }
                        defaultValue={ value }
                        onChange={ handleChange }
                        valueLabelDisplay="auto"
                        step={ 0.5 }
                        marks={ marks }
                        min={0}
                        max={10}
                        disableSwap
                        size="md"
                        variant="solid"
                    />
                </Box> */}
                <DataRangeEdit />
                <ColorMapEditor
                  colorMap={theColorMap}
                  onChange={handleColorMapChange}
                />
        </Stack>
    );
};