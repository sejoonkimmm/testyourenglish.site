import React from 'react';
import styled, { css } from 'styled-components';
import { slideIn, slideOut } from '../styles/theme';
import { useNavigate } from 'react-router-dom';

interface PanelProps {
  isPanelOpen: boolean;
  togglePanel: () => void;
  setPanelOn: () => void;
  setPanelOff: () => void;
  children: React.ReactNode;
}

const PanelWrapper = styled.div<{ $isPanelOpen: boolean }>`
  background-color: ${({ theme }) => theme.colors.panelBackground};
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease-in-out;

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: absolute;
    right: 0;
    top: 0;
    width: ${({ theme }) => theme.sizes.PanelDesktop};
    flex-direction: row;
    box-shadow: -4px 0 10px rgba(0, 0, 0, 0.2);
  }

  /* Mobile View */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: ${({ $isPanelOpen, theme }) =>
      $isPanelOpen ? theme.sizes.PanelMobileMax : theme.sizes.PanelMobileMin};
    z-index: 100;
    overflow: hidden;
    animation: ${({ $isPanelOpen }) =>
      $isPanelOpen
        ? css`
            ${slideIn} 0.3s ease-in-out
          `
        : css`
            ${slideOut} 0.3s ease-in-out
          `};
    box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
  }
`;

const PanelHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 0;

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 1px;
    height: 100vh;
    flex-direction: column; /* vertical */
    padding: 10px;
  }
`;

const PanelContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  height: 100%;

  /* Desktop */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const CloseLine = styled.div`
  width: 15vw;
  font-size: 1px;
  background: ${({ theme }) => theme.colors.primary};
  height: 5px;
  border-radius: 5px;
`;

const PanelContentWrapper = styled.div`
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 100%;
    width: calc(100% - 1px);
  }

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 100%;
    width: calc(100% - 1px);
  }
`;

const PanelContentHeaderWrapper = styled.div`
  height: 80px;
  display: flex;
  padding: 20px 10px;
  background-color: ${({ theme }) => theme.colors.panelBackground};

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: left;
    gap: 15px;
  }

  /* Mobile View */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    justify-content: space-between;
  }
`;

const Hr = styled.hr`
  width: 70%;
  margin: 0 auto;

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const Button = styled.button`
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.5rem;
  font-weight: 800;
`;

const Panel: React.FC<PanelProps> = ({
  isPanelOpen,
  togglePanel,
  setPanelOn,
  setPanelOff,
  children,
}) => {
  const navigate = useNavigate();
  const isArticleRoute = location.pathname.startsWith('/article');
  const handleSubjectClick = () => {
    setPanelOn();
    navigate('/');
  };
  const handleHistoryClick = () => {
    setPanelOn();
    navigate('/history');
  };

  return (
    <PanelWrapper $isPanelOpen={isPanelOpen}>
      <PanelHeader onClick={togglePanel}>
        <CloseButton>
          <CloseLine>&nbsp;</CloseLine>
        </CloseButton>
      </PanelHeader>
      <PanelContent>
        <PanelContentWrapper>
          {!isArticleRoute && (
            <>
              <PanelContentHeaderWrapper>
                <Button onClick={handleSubjectClick}>Subject</Button>
                <Button onClick={handleHistoryClick}>History</Button>
              </PanelContentHeaderWrapper>
              <Hr />
            </>
          )}
          {children}
        </PanelContentWrapper>
      </PanelContent>
    </PanelWrapper>
  );
};

export default Panel;
