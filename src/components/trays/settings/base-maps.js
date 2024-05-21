import * as React from 'react';
import { Popover } from '@mui/material';
import { 
    IconButton,
    Stack,
    Typography } from '@mui/joy';
import Avatar from '@mui/joy/Avatar';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Map } from '@mui/icons-material';

export function BaseMaps() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


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
        <RadioGroup
            aria-label="platform"
            overlay
            name="platform"
            defaultValue = "Website"
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
            {['Website', 'Documents', 'Social Account'].map((value) => (
                <Sheet
                key={value}
                variant="outlined"
                sx={{
                    borderRadius: 'md',
                    boxShadow: 'sm',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 2,
                    minWidth: 120,
                }}
                >
                <Radio id={value} value={value} checkedIcon={<CheckCircleRoundedIcon/>} 
                    sx={{padding: '10px'}}/>
                <Avatar variant="soft" size="sm" />
                <FormLabel htmlFor={value}>{value}</FormLabel>
                </Sheet>
            ))}
            </RadioGroup>
        </Popover>
    </Stack>
  );
}