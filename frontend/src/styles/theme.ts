import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    background: '#121212',
    background_darker: '#060606',
    background_gradient: 'linear-gradient(180deg, #242424 0%, #181920 100%);',
    text: '#d3d2d2',
    primary: '#f0f0f0',
    secondary: '#d1d1d1',
    success: '#28a745',
    failure: '#dc3545',
  },
  breakpoints: {
    mobile: '400px',
    desktop: '1280px',
  },
};
