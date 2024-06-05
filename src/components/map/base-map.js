import { React, Fragment } from "react";
import { TileLayer } from 'react-leaflet';
import {
    useLayers,
  } from '@context';

export const BaseMap = () => {
    //const { darkMode } = useSettings();
    const { baseMap } = useLayers();

    return(
        <Fragment>
           {baseMap && <TileLayer url={baseMap.url}
                      attribution={baseMap.attribution} />}
        </Fragment>
    );
};