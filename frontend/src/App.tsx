import React, { useState } from 'react';
import styled from 'styled-components';

import GlobalStyle from './styles/globalStyles';
import { fontTitleStyle, fontLightStyle } from './styles/theme';

import { ThemeProvider } from './contexts/ThemeContext';
import ArticleInterface from './interface/ArticleInterface';

import Panel from './components/Panel';
import articles from './articles/_articles';
import ArticleList from './articles/ArticleList';

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: hidden;
  transition: 0.3s;
`;

const Content = styled.div`
  flex: 1;
  padding: 30px 20px;
  text-align: center;

  background-image: url('images/background.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

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
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const articleList: ArticleInterface[] = articles;

  return (
    <ThemeProvider>
      <GlobalStyle />
      <Wrapper>
        <Content>
          <h1 style={fontTitleStyle}>Test Your English!</h1>
          <p style={fontLightStyle}>Your privite essay reviewer.</p>
          <hr style={{ width: '30%', marginTop: '32px' }} />
          <ArticleList articleList={articleList} />
        </Content>
        <Panel isPanelOpen={isPanelOpen} togglePanel={togglePanel}>
          <h1>Subject</h1>
        </Panel>
      </Wrapper>
    </ThemeProvider>
  );
};

export default App;
