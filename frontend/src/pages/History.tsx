import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: calc(100% - 100px);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const History: React.FC = () => {
  return (
    <Wrapper>
      This is History Part.
      <div> test </div>
    </Wrapper>
  );
};

export default History;
