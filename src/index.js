// import React from 'react';
// import { CssVarsProvider } from '@mui/joy/styles';
// import { createRoot } from 'react-dom/client';
// import { App } from './app';
// import { LayersProvider, SettingsProvider } from '@context';
// import './index.css';
// import '@fontsource/inter';
// import theme from './theme';
//
// const container = document.getElementById('root');
// const root = createRoot(container);
//
// const ProvisionedApp = () => (
//   <CssVarsProvider theme={ theme } defaultMode="system">
//     <SettingsProvider>
//       <LayersProvider>
//         <App />
//       </LayersProvider>
//     </SettingsProvider>
//   </CssVarsProvider>
// );

import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app';
import { LayersProvider, SettingsProvider } from '@context';
import './index.css';
import '@fontsource/inter';
import theme from './theme';

import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider
  ,THEME_ID as MATERIAL_THEME_ID,
} from '@mui/material/styles';
import { CssVarsProvider as JoyCssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/material/CssBaseline';

const container = document.getElementById('root');
const root = createRoot(container);

const materialTheme = materialExtendTheme();

const ProvisionedApp = () => {
    return (
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
    );
};

root.render(<ProvisionedApp />);