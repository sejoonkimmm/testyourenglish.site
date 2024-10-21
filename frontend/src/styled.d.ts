import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      background_darker: string;
      background_gradient: string;
      text: string;
      primary: string;
      secondary: string;
      success: string;
      failure: string;
    };
    breakpoints: {
      mobile: string;
      desktop: string;
    };
  }
}
