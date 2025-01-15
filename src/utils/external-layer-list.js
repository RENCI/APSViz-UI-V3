export const externalLayerList = [
    {
        // this one doesn't work yet because this service does not support EPSG:3857
        name: "NOAA Blended Daily Sea Surface Temperature",
        source: "NOAA Coast Watch ERDDAP Server",
        url: "https://coastwatch.noaa.gov/erddap/wms/noaacwBLENDEDsstDNDaily/request",
        layer: "noaacwBLENDEDsstDNDaily:analysed_sst",
        params: {format: "image/png", transparent: true, srs: "EPSG:4326",},
        visible: false,
    },
    {
        name: "GOES Sea Surface Temperature",
        source: "Maracoos THREDDS Server",
        url: "https://tds.maracoos.org/wms",
        layer: "GOES_SST/sst",
        params: {format: "image/png", transparent: true, srs: "EPSG:3857", styles: "raster/GHRSST_L4_MUR_Sea_Surface_Temperature"},
        visible: false,
    },
];