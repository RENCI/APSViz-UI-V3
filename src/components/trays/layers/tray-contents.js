import React, { useCallback, useState } from 'react';
import { Button, Stack } from '@mui/joy';
import {
  Add as AddLayerIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { LayersList } from './list';
import { AddLayerForm } from './form';

const FORM = 'FORM';
const LIST = 'LIST';

export const TrayContents = () => {
  const [state, setState] = useState(LIST);

  const handleClickToggleState = () => {
    if (state === FORM) {
      setState(LIST);
      return;
    }
    setState(FORM);
  };

  const TrayFooter = useCallback(() => {
    if (state === LIST) {
      return (
        <Stack p={ 2 }>
          <Button
            size="lg"
            startDecorator={ <AddLayerIcon /> }
            onClick={ handleClickToggleState }
          >Add a Model Run</Button>
        </Stack>
      );
    }
    return (
      <Stack p={ 2 }>
        <Button
          size="lg"
          color="warning"
          startDecorator={ <CloseIcon /> }
          onClick={ handleClickToggleState }
        >Cancel</Button>
      </Stack>
    );
  }, [state]);

  return (
    <Stack sx={{
      height: '100%',
      '.MuiList-root': { p: 0 },
      '.MuiListItem-root': { my: 1 },
    }}>
      { state === LIST && <LayersList /> }

      { state === FORM && <AddLayerForm /> }

      <TrayFooter />
    </Stack>
  );
};
