import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
`;

const Img = styled.img`
width: 90%;
  height: auto;
  margin-top: -10%;
  `;
  
const Text = styled.a`
  color: ${({ theme }) => theme.colors.text};
  text-decoration-line: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 300;
`;

const ErrorPage: React.FC = () => {
  let img;

  switch (Math.floor(Math.random() * 3)) {
    case 0:
      img = '/youshallnotpass.jpeg';
      break;
    case 1:
      img = '/whatthehell.jpg';
      break;
    default:
      img = '/tony404.jpg';
      break;
  }
  
  return (
    <Wrapper>
      <Img src={img} />
      <Text href="/">
        This page doesn't exist, please go back!
      </Text>
    </Wrapper>
  );
};

export default ErrorPage;
