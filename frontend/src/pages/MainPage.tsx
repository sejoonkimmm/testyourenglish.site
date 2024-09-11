import React, { useState } from 'react';
import styled from 'styled-components';
import Panel from '../components/Panel';

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
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.colors.contentBackground};
`;

const MainPage: React.FC = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <Wrapper>
      <Panel isPanelOpen={isPanelOpen} togglePanel={togglePanel}>
        <h1>Subject</h1>
      </Panel>
      <Content>
        <h1>Subject</h1>
        <p>Your essay subject will appear here.</p>
      </Content>
    </Wrapper>
  );
};

export default MainPage;
