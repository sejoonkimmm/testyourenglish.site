import React, { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { theme } from './styles/theme';
import GlobalStyle from './styles/globalStyles';

import fetchTopicsFromServer from './api/fetchTopicsFromServer';
import useTopicStore from './store/useTopicStore';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import ErrorPage from './pages/ErrorPage';

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Content = styled.div<{ $width: number; $height: number }>`
  width: ${({ $width }) => `${$width}px`};
  height: ${({ $height }) => `${$height}px`};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
  }
`;

const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const App: React.FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { topics, fetchTopics } = useTopicStore();

  useEffect(() => {
    const updateDimensions = () => {
      const { innerWidth, innerHeight } = window;
      const aspectRatio = 9 / 16;
      let width = innerWidth * 0.85;
      let height = width / aspectRatio;

      if (height > innerHeight * 0.85) {
        height = innerHeight * 0.85;
        width = height * aspectRatio;
      }

      setDimensions({ width, height });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (topics.length === 0) {
      const fetchServerTopics = async () => {
        try {
          const topics = await fetchTopicsFromServer();
          fetchTopics(topics);
        } catch (error) {
          console.error('Failed to fetch topics:', error);
        }
      };

      fetchServerTopics();
    }
  }, [fetchTopics, topics.length]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Wrapper>
          <Content $width={dimensions.width} $height={dimensions.height}>
            <Navbar />
            <ScrollableContent>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<ErrorPage />} />
              </Routes>
            </ScrollableContent>
          </Content>
        </Wrapper>
      </Router>
    </ThemeProvider>
  );
};

export default App;
