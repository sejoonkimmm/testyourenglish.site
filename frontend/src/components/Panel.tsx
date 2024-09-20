import React from 'react';
import styled, { css } from 'styled-components';
import { slideIn, slideOut } from '../styles/theme';

interface PanelProps {
  isPanelOpen: boolean;
  togglePanel: () => void;
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

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 1px;
    height: 100vh;
    flex-direction: column; /* vertical */
    padding: 10px;
  }
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 10px 15px;
  display: block;

  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex: 1;
  }
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

const Panel: React.FC<PanelProps> = ({
  isPanelOpen,
  togglePanel,
  children,
}) => {
  return (
    <PanelWrapper $isPanelOpen={isPanelOpen}>
      <PanelHeader onClick={togglePanel}>
        <CloseButton>
          <CloseLine>&nbsp;</CloseLine>
        </CloseButton>
      </PanelHeader>
      <PanelContent>{children}</PanelContent>
    </PanelWrapper>
  );
};

export default Panel;
