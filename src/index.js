import React, { Fragment } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { LayersProvider, SettingsProvider } from '@context';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
    experimental_extendTheme as materialExtendTheme,
    Experimental_CssVarsProvider as MaterialCssVarsProvider,
    THEME_ID as MATERIAL_THEME_ID
} from '@mui/material/styles';

import './index.css';
import '@fontsource/inter';
import theme from './theme';

const queryClient = new QueryClient();

// get a reference to the root element used as a rendering target
const container = document.getElementById('root');

// create the root container
const root = createRoot(container);

// create a new material theme. this is so it can be differentiated from the joy theme
const materialTheme = materialExtendTheme();

// render the app specifying the material and joy providers
const ProvisionedApp = () => {
    // render the app
    return (
        <Fragment>
            <QueryClientProvider client={ queryClient }>
                <MaterialCssVarsProvider theme={{ [MATERIAL_THEME_ID]: materialTheme }}>
                    <JoyCssVarsProvider theme={ theme }>
                        <CssBaseline enableColorScheme />
                        <SettingsProvider>
                            <LayersProvider>
                                <App />
                            </LayersProvider>
                        </SettingsProvider>
                    </JoyCssVarsProvider>
                </MaterialCssVarsProvider>
            </QueryClientProvider>
        </Fragment>
    );
};

// render the app
root.render(<ProvisionedApp />);