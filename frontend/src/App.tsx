import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import GlobalStyle from './styles/globalStyles';
import { fontTitleStyle, fontLightStyle } from './styles/theme';

import { ThemeProvider } from './contexts/ThemeContext';
import ArticleInterface from './interface/ArticleInterface';

import Panel from './components/Panel';
import articles from './articles/_articles';
import ArticleList from './articles/ArticleList';
import ArticleDetail from './articles/ArticleDetail';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  transition: 0.3s;

  background-image: url('/images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px 20px;
  text-align: center;

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: ${({ theme }) => theme.sizes.ContentDesktop};
  }

  /* Mobile View */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-width: 100%;
  }
`;

const App: React.FC = () => {
  // Pannel Control
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  // Router Control
  const navigate = useNavigate();
  const handleLogoClick = () => {
    setIsPanelOpen(false);
    navigate('/');
  };
  const handleArticleClick = (articleId: string) => {
    setIsPanelOpen(true);
    navigate(`/article/${articleId}`);
  };

  const articleList: ArticleInterface[] = articles;

  return (
    <ThemeProvider>
      <GlobalStyle />
      <Wrapper>
        <Content>
          <h1 onClick={handleLogoClick} style={fontTitleStyle}>
            Test Your English!
          </h1>
          <p style={fontLightStyle}>Your private essay reviewer.</p>
          <hr style={{ width: '30%', marginTop: '32px' }} />
          <ArticleList
            articleList={articleList}
            onArticleClick={handleArticleClick}
          />
        </Content>
        <Panel isPanelOpen={isPanelOpen} togglePanel={togglePanel}>
          <Routes>
            <Route path="/article/:articleId" element={<ArticleDetail />} />
            <Route path="/" element={<h1>Subject</h1>} />
          </Routes>
        </Panel>
      </Wrapper>
    </ThemeProvider>
  );
};

export default App;
