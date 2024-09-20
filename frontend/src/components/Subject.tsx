import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: calc(100% - 100px);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const SubjectText = styled.h2`
  margin: 20px 0;
`;

const TextArea = styled.textarea<{ $isOverLimit: boolean }>`
  width: 100%;
  height: calc(100vh - 400px);
  padding: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  resize: none;
  font-size: 2rem;
  border: ${({ $isOverLimit }) =>
    $isOverLimit
      ? '2px solid red'
      : '1px solid ${({ theme }) => theme.colors.text}'};
`;

const WordCount = styled.p<{ $isOverLimit: boolean }>`
  color: ${({ $isOverLimit, theme }) =>
    $isOverLimit ? 'red' : theme.colors.text};
  font-size: 1.3rem;
  font-weight: 100;
  text-align: right;
`;

const Tip = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 100;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SubmitButton = styled.button`
  background: none;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.5rem;
  font-weight: 800;
  width: 20%;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 15px;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};
`;

const MAX_LETTERS = 2500;
const MAX_WORDS = 250;
const MIN_WORDS = 150;

const Subject: React.FC = () => {
  const [essayText, setEssayText] = useState('');
  const wordCount = essayText.split(' ').filter((word) => word).length;
  const isOverLetterLimit = essayText.length > MAX_LETTERS;
  const isOverLimit = wordCount > MAX_WORDS;
  const isLessLimit = wordCount < MIN_WORDS;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayText(e.target.value);
  };

  const handleSubmit = () => {
    // 제출 로직 (서버로 전송 등)
    if (!isLessLimit && !isOverLimit && !isOverLetterLimit)
      console.log('Essay Submitted:', essayText);
    else console.log('Check Letter Length. Too less or Too much:', essayText);
  };

  return (
    <Wrapper>
      <SubjectText>
        Write an essay about the "The Impact of Technology on Education".
      </SubjectText>
      <Tip>Tip: Make sure your essay is concise and well-structured.</Tip>
      <WordCount $isOverLimit={isOverLimit}>
        {wordCount}/{MAX_WORDS} words
      </WordCount>
      <TextArea
        value={essayText}
        onChange={handleTextChange}
        $isOverLimit={isOverLimit}
      />
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Wrapper>
  );
};

export default Subject;
