import useLayers from '../context/map-context'
import { StacApiProvider } from "stac-react";

const {
  defaultModelLayers,
  setDefaultModelLayers,
  filteredModelLayers,
  setFilteredModelLayers
  } = useLayers();


// Utilities to access the stac catalog items to load on map 
const stacCatalog = ({stacUrl}) => {
};