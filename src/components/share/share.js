import React, { Fragment } from 'react';
import { Card, Stack } from '@mui/joy';
import { BuildLink } from './buildlink';
// import { Screenshot } from './screenshot';

/**
 * renders the shared content on the app as defined in the query string
 *
 * @returns {JSX.Element}
 * @constructor
 */
export const Share = () => {
    return (
        <Fragment>
            <Card
                sx={{
                    p: 0,
                    position: 'absolute',
                    top: 'calc(4 * var(--joy-spacing))',
                    right: 150,
                    transition: 'filter 250ms',
                    filter: 'opacity(0.9)',
                    '&:hover': { filter: 'opacity(1.0)' },
                    height: 50,
                    width: 80,
                    padding: '0px',
                    zIndex: 410,
                    borderRadius: 'sm'
              }}>
                <Stack
                    sx={{
                        p: 0,
                        m: 0,
                        height: '100%'}}
                        direction="row"
                        //gap={ 1 }
                    alignItems="center">
                    <BuildLink />
                    {/*<Screenshot />*/}
                </Stack>
            </Card>
        </Fragment>
    );
};
