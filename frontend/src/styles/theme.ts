import { css, DefaultTheme } from 'styled-components';

const common = {
  colors: {
    background: '#212121',
    secondary: '#545454',
    contentBackground: '#4B504A',
  },
  breakpoints: {
    mobile: '768px',
    desktop: '1280px',
  },
  sizes: {
    ContentDesktop: '430px',
    PanelDesktop: 'calc(100vw - 430px)',
    ContentMobile: 'calc(100px)',
    PanelMobileMin: '100px',
    PanelMobileMax: 'calc(100vh - 100px)',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    ...common.colors,
    innerBackground: '#0E0E10',
    text: '#E6E6F2',
    primary: '#ffffff',
    panelBackground: '#19181B',
  },
  breakpoints: common.breakpoints,
  sizes: common.sizes,
};

export const lightTheme: DefaultTheme = {
  colors: {
    ...common.colors,
    innerBackground: '#0E0E10',
    text: '#E6E6F2',
    primary: '#ffffff',
    panelBackground: '#19181B',
  },
  breakpoints: common.breakpoints,
  sizes: common.sizes,
};

export const slideIn = css`
  @keyframes slideIn {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const slideOut = css`
  @keyframes slideOut {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }
`;
