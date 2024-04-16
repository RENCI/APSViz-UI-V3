import useLayers from '../context/map-context'
import { StacApiProvider } from "stac-react";

const {
    currentModelRunSet,
    setCurrentModelRunSet,
  } = useLayers();


// Utilities to access the stac cataolog items to load on map 
const stacCatalog = ({stacUrl}) => {
};