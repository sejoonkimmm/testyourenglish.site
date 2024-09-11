import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      innerBackground: string;
      text: string;
      primary: string;
      secondary: string;
      contentBackground: string;
      panelBackground: string;
    };
    breakpoints: {
      mobile: string;
      desktop: string;
    };
    sizes: {
      PanelDesktop: string;
      PanelMobileMin: string;
      PanelMobileMax: string;
    };
  }
}
