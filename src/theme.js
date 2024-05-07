import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  breakpoints: {
    keys: ['xs', 'sm', 'md', 'lg', 'xl'],
    values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
    unit: 'px',
  },
  defaultMode: 'system',
  direction: 'ltr',
  palette: {
    mode: 'light',
    primary: {
      50: '#f0f7ff',
      100: '#c2e0ff',
      200: '#99ccf3',
      300: '#66b2ff',
      400: '#3399ff',
      500: '#007fff',
      600: '#0072e5',
      700: '#0059b2',
      800: '#004c99',
      900: '#003a75',
      main: '#007fff',
      light: '#66b2ff',
      dark: '#0059b2',
      contrastText: '#fff'
    },
    secondary: {
      50: '#f3f6f9',
      100: '#e5eaf2',
      200: '#dae2ed',
      300: '#c7d0dd',
      400: '#b0b8c4',
      500: '#9da8b7',
      600: '#6b7a90',
      700: '#434d5b',
      800: '#303740',
      900: '#1c2025',
      main: '#dae0e7',
      contrastText: '#2f3a46',
      light: 'rgb(225, 230, 235)',
      dark: 'rgb(152, 156, 161)'
    },
    divider: '#e5eaf2',
    primaryDark: {
      50: '#eaedf1',
      100: '#dae0e7',
      200: '#acbac8',
      300: '#7b91a7',
      400: '#4b5e71',
      500: '#3b4a59',
      600: '#2f3a46',
      700: '#1f262e',
      800: '#141a1f',
      900: '#101418',
      main: '#7b91a7'
    },
    common: {
      black: '#0b0d0e',
      white: '#fff'
    },
    text: {
      primary: '#1c2025',
      secondary: '#434d5b',
      tertiary: '#6b7a90',
      disabled: 'rgba(0, 0, 0, 0.38)'
    },
    grey: {
      50: '#f3f6f9',
      100: '#e5eaf2',
      200: '#dae2ed',
      300: '#c7d0dd',
      400: '#b0b8c4',
      500: '#9da8b7',
      600: '#6b7a90',
      700: '#434d5b',
      800: '#303740',
      900: '#1c2025',
      main: '#e5eaf2',
      contrastText: '#6b7a90',
      A100: '#f5f5f5',
      A200: '#eeeeee',
      A400: '#bdbdbd',
      A700: '#616161'
    },
    error: {
      50: '#fff0f1',
      100: '#ffdbde',
      200: '#ffbdc2',
      300: '#ff99a2',
      400: '#ff7a86',
      500: '#ff505f',
      600: '#eb0014',
      700: '#c70011',
      800: '#94000d',
      900: '#570007',
      main: '#eb0014',
      light: '#ff99a2',
      dark: '#c70011',
      contrastText: '#fff'
    },
    success: {
      50: '#e9fbf0',
      100: '#c6f6d9',
      200: '#9aefbc',
      300: '#6ae79c',
      400: '#3ee07f',
      500: '#21cc66',
      600: '#1db45a',
      700: '#1aa251',
      800: '#178d46',
      900: '#0f5c2e',
      main: '#1aa251',
      light: '#6ae79c',
      dark: '#1aa251',
      contrastText: '#fff'
    },
    warning: {
      50: '#fff9eb',
      100: '#fff3c1',
      200: '#ffeca1',
      300: '#ffdc48',
      400: '#f4c000',
      500: '#dea500',
      600: '#d18e00',
      700: '#ab6800',
      800: '#8c5800',
      900: '#5a3600',
      main: '#dea500',
      light: '#ffdc48',
      dark: '#ab6800',
      contrastText: 'rgba(0, 0, 0, 0.87)'
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#fff'
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
    background: {
      paper: '#fff',
      default: '#fff'
    },
  },
  shape: {
    borderRadius: 12
  },
});

export default theme;
