import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string;
      innerBackground: string;
      text: string;
      _green: string;
      _yellow: string;
      _orange: string;
      _red: string;
      _warning_orange: string;
      _warning_red: string;
      primary: string;
      secondary: string;
    };
  }
}
