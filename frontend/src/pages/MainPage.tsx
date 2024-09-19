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
  padding: 30px 15px;
  text-align: center;

  /* 배경 이미지 추가 및 투명도 적용 */
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

const fontTitleStyle = {
  fontFamily: 'Ananda Black',
  wordSpacing: '5px',
};

const fontLightStyle = {
  fontWeight: '100',
};

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
        <h1 style={fontTitleStyle}>Test Your English!</h1>
        <p style={fontLightStyle}>Your privite essay reviewer.</p>
        <hr style={{ width: '30%', marginTop: '20px' }} />
      </Content>
    </Wrapper>
  );
};

export default MainPage;
