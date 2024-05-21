import { React, Fragment } from "react";
import { TileLayer } from 'react-leaflet';
import {
    useLayers,
    useSettings,
  } from '@context';

export const BaseMap = () => {
    const { darkMode } = useSettings();

    return(
        <Fragment>
            { darkMode.enabled
                ? <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu3inqs05v901qlabcfhxsr/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
                : <TileLayer url={ `https://api.mapbox.com/styles/v1/mvvatson/clvu2u7iu061901ph15n55v2e/tiles/256/{z}/{x}/{y}@2x?access_token=${ process.env.REACT_APP_MAPBOX_TOKEN }` } />
            }
        </Fragment>
    );
}