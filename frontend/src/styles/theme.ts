import { css, DefaultTheme } from 'styled-components';

const common = {
  colors: {
    background: '#212121',
    contentBackground: '#4B504A',
    innerBackground: '#0E0E10',
    text: '#E6E6F2',
    primary: '#ffffff',
    secondary: '#d1d1d1',
    panelBackground: '#19181B',
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
    PanelMobileMax: 'calc(100vh - 150px)',
  },
};

export const lightTheme: DefaultTheme = {
  colors: common.colors,
  breakpoints: common.breakpoints,
  sizes: common.sizes,
};

export const darkTheme: DefaultTheme = {
  colors: common.colors,
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

// --------------------------------------------------------------------

export const fontTitleStyle = {
  fontFamily: 'Ananda Black',
  wordSpacing: '5px',
};

export const fontLightStyle = {
  fontWeight: '100',
};
