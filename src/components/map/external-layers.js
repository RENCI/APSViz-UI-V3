import React from 'react';
import { WMSTileLayer } from 'react-leaflet';
import { externalLayerList } from '@utils/external-layer-list';

// external layers are other types of related map layers
// that are provided by external map services other than MetGet
// the map service details are defined in ...
// external layer can be features or coverages (i.e. rasters)
// the last layer selected, to be displayed, from list of
// external layers will be moved to the top of the external
// layers list and displayed imeediately

export const ExternalLayers = () => {

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwBLENDEDsstDNDaily/request";
    //const sst_layer = "noaacwBLENDEDsstDNDaily:analysed_sst";

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwecnAVHRRmultisatsstEastCoastMonthly/request";
    //const sst_layer = "noaacwecnAVHRRmultisatsstEastCoastMonthly:sst";

    //const sst_url = "https://coastwatch.noaa.gov/erddap/wms/noaacwecnAVHRRmultisatsstEastCoast3Day/request";
    //const sst_layer = "noaacwecnAVHRRmultisatsstEastCoast3Day:sst";

    const sst_url = "https://tds.maracoos.org/wms";
    const sst_layer = "GOES_SST/sst";

    const wmsLayerParams = {
        format: "image/png",
        transparent: true,
        srs: "EPSG:3857",
        styles: "raster/GHRSST_L4_MUR_Sea_Surface_Temperature",
    };
    
    // externalLayerList.map((layer) => {
    //     console.log(layer.url);
    //     console.log(layer.name);
    //     console.log(layer.params);
    // });

    return (
        <>
        {externalLayerList.map((layer) => (
            <WMSTileLayer
                /* key={layer.name}
                url={layer.url}
                layers={layer.name}
                params={layer.params} */
                key={sst_layer}
                url={sst_url}
                layers={sst_layer}
                params={wmsLayerParams}
            />
        ))};
        </>
    );
};