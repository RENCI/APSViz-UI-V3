import * as React from 'react';
import { Popover } from '@mui/material';
import { 
    Box,
    FormLabel,
    IconButton,
    Radio,
    radioClasses,
    RadioGroup,
    Sheet,
    Stack,
    Typography } from '@mui/joy';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Map } from '@mui/icons-material';
import { useLayers } from '@context';
import { BasemapList } from '@utils/map-utils';
import { useLocalStorage } from '@hooks';

export function BaseMaps() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { baseMap, setBaseMap } = useLayers();
  const [storedValue, setStoredValue] = useLocalStorage('basemap', '');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeBaseMap = (event) => {
    const basemapTitle = event.target.value;
    const selectedBasemap = BasemapList.filter((map) => map.title === basemapTitle);
    if (selectedBasemap.length === 1) {
      setBaseMap(selectedBasemap[0]);
      setStoredValue(selectedBasemap[0].title);
    }
  };

  React.useEffect(() => {
    if (storedValue) {
      const valueList = BasemapList.filter((map) => map.title === storedValue);
      if (valueList.length > 0) {}
        setBaseMap(valueList[0]);
    }
    else {
      setBaseMap(BasemapList[0]);
    }
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="flex-start"
      gap={ 2 }
    >
      <IconButton aria-describedby={id} variant="outlined"  size="lg" onClick={handleClick}>
        <Map />
      </IconButton>
      <Typography level="title-md">
          Basemaps
        </Typography>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        { baseMap && <RadioGroup
            aria-label="platform"
            overlay
            name="platform"
            defaultValue = {baseMap.title}
            sx={{
                flexDirection: 'row',
                gap: 2,
                margin: '20px',
                [`& .${radioClasses.checked}`]: {
                [`& .${radioClasses.action}`]: {
                    inset: -1,
                    border: '3px solid',
                    borderColor: 'primary.500',
                },
                },
                [`& .${radioClasses.radio}`]: {
                display: 'contents',
                '& > svg': {
                    zIndex: 2,
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    bgcolor: 'background.surface',
                    borderRadius: '50%',
                },
                },
            }}
            >
            {BasemapList.map((basemap) => (
                <Sheet
                key={basemap.title}
                variant="outlined"
                sx={{
                    borderRadius: 'md',
                    boxShadow: 'sm',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    minWidth: 100,
                }}
                >
                <Radio id={basemap.title} value={basemap.title} onChange={changeBaseMap} checkedIcon={<CheckCircleRoundedIcon />} 
                    sx={{padding: '0px'}}/>
                <Box
                    component="img"
                    sx={{maxWidth: 120, alignSelf: 'center'}}
                    alt={basemap.title}
                    src={basemap.thumbnail}
                />
                 <FormLabel htmlFor={basemap.title}>{basemap.title}</FormLabel>
                </Sheet>
            ))}
            </RadioGroup>}
        </Popover>
    </Stack>
  );
}