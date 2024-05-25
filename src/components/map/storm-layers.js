import React, { useState, useEffect} from 'react';
import { GeoJSON } from 'react-leaflet';
import {
    getTrackData,
    getTrackGeojson
} from "@utils/hurricane/track";
import { useLayers } from '@context';

const hurricaneLayerTypes = ["cone", "line", "labels", "points"];

const newLayerDefaultState = () => {
    return ({
        visible: true,
        opacity: 1.0,
    });
  };

export const StormLayers = () => {

  const {
    defaultModelLayers,
    hurricaneTrackLayers,
    setHurricaneTrackLayers,
  } = useLayers();
  const [hurricaneData, setHurricaneData] = useState();

  const layer_list = defaultModelLayers;
  const topLayer = layer_list[0];

  useEffect(() => {

    async function getStormLayers() {
      
     if (topLayer && topLayer.properties.met_class === 'synoptic') {
      const id = topLayer.id.substr(0, topLayer.id.lastIndexOf("-")) + '-hurr';
      // get year, storm number, and advisory for this storm
      const year = topLayer.properties.run_date.substring(0, 4);
      let stormNumber = topLayer.properties.storm_number;
      // storm number can sometimes start with "al" so must remove if so
      if (stormNumber && stormNumber.length > 3)
        stormNumber = stormNumber.slice(2);
      const advisory = topLayer.properties.advisory_number;
      const stormName = topLayer.properties.advisory_number;

      let trackGeojson = null;

      //getTrackData(year, stormNumber, advisory).then((track) => {
      getTrackData("2023", "10", "17").then((track) => {
        if (track != null) {
          trackGeojson = getTrackGeojson(
            track,
            "utc",
            'IDALIA'
          );
        }
      });
      setHurricaneData(trackGeojson);

      // now create some metadata for this layer
      // and save in hurricaneTrackLayers
      const trackLayer = [{
        id: id,
        stormName: stormName,
        stormNumber: stormNumber,
        runDate: topLayer.properties.run_date,
        advisory: advisory,
        instanceName: topLayer.properties.instance_name,
        eventType: topLayer.properties.event_type,
        state: newLayerDefaultState()
      }];

      // check to make sure we actually got geojson data
      // before creating layer
      if (trackGeojson) {
        setHurricaneData(trackGeojson);
        setHurricaneTrackLayers([...trackLayer, ...hurricaneTrackLayers]);
      }
     }
    }

    getStormLayers().then();
  }, [layer_list]);

    return(
      <>
        {hurricaneTrackLayers
            .filter(({state}) => state.visible)
            //.reverse()
            .map((layer) => {
                //const opacity = layer.state.opacity;
                console.log(layer);
                {hurricaneData && hurricaneLayerTypes
                  .map((type) => {
                    console.log(hurricaneData);
                    return (
                        <GeoJSON
                            key={`${layer.id}-${type}`}
                            data={hurricaneData[{type}]}
                        />
                    );
                 });
                }
            })
        };     
      </>
    );
  };