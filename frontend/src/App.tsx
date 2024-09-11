import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import GlobalStyle from './styles/globalStyles';
import { ThemeProvider } from './contexts/ThemeContext';

import MainPage from './pages/MainPage';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
