import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './styles/globalStyles';
import { ThemeProvider } from './contexts/ThemeContext';

import MainPage from './pages/MainPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
};

export default App;
