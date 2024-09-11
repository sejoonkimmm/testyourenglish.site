import { css, DefaultTheme } from 'styled-components';

export const AspectRatio = 18 / 9;

const common = {
  colors: {
    background: '#212121',
    secondary: '#545454',
    _green: '#11D05B',
    _yellow: '#FFBD44',
    _orange: '#FF7A00',
    _red: '#FF605C',
    _warning_orange: '#FF7A00',
    _warning_red: '#FF0000',
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    ...common.colors,
    innerBackground: '#0E0E10',
    text: '#E6E6F2',
    primary: '#ffffff',
  },
};

export const lightTheme: DefaultTheme = {
  colors: {
    ...common.colors,
    innerBackground: '#F6F6F6',
    text: '#1C1C1E',
    primary: '#000000',
  },
};

export const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export const fadeOut = css`
  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;
