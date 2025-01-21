import React, { Fragment } from 'react';
import { WMSTileLayer } from 'react-leaflet';
import { useLayers } from '@context/map-context';

// external layers are other types of related map layers
// that are provided by external map services other than MetGet
// the map service details are defined in ...
// external layer can be features or coverages (i.e. rasters)
// the last layer selected, to be displayed, from list of
// external layers will be moved to the top of the external
// layers list and displayed immediately

export const ExternalLayers = () => {
    // storage from state for rendering external layers
    const {
        externalLayers
    } = useLayers();

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwBLENDEDsstDNDaily/request";
    //const sst_layer = "noaacwBLENDEDsstDNDaily:analysed_sst";

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwecnAVHRRmultisatsstEastCoastMonthly/request";
    //const sst_layer = "noaacwecnAVHRRmultisatsstEastCoastMonthly:sst";

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwecnAVHRRmultisatsstEastCoast3Day/request";
    //const sst_layer = "noaacwecnAVHRRmultisatsstEastCoast3Day:sst";

    if (externalLayers != null) {
        return (
            <Fragment>
                {
                    externalLayers
                    .filter(item => item.state.visible === true)
                    .map(
                        (layer) => (
                            <WMSTileLayer
                                key={layer.name}
                                url={layer.url}
                                layers={layer.layer}
                                params={layer.params}
                            />
                        )
                    )
                }
            </Fragment>
        );
    }
};