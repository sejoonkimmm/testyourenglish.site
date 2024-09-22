import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: calc(100% - 80px); /* 고정된 높이 설정 */
  }

  /* Mobile View */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: calc(100% - 160px); /* 고정된 높이 설정 */
  }
`;

const SubjectInfo = styled.div`
  margin: 0;
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 300;
`;

const SubjectText = styled.div`
  text-align: center;
  font-size: 1.7rem;
  font-weight: 700;
  margin: 15px 0;
`;

const BeforeTextArea = styled.div``;

const WordCount = styled.div<{ $isOverLimit: boolean }>`
  color: ${({ $isOverLimit, theme }) =>
    $isOverLimit ? 'red' : theme.colors.text};
  font-size: 1rem;
  font-weight: 100;
  text-align: right;
  margin-bottom: 5px;
`;

const TextArea = styled.textarea<{ $isOverLimit: boolean }>`
  width: 100%;
  min-height: calc(100vh - 400px);
  padding: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  resize: none;
  font-size: 1.2rem;
  border: ${({ $isOverLimit }) =>
    $isOverLimit
      ? '2px solid red'
      : '1px solid ${({ theme }) => theme.colors.text}'};
`;

const Tip = styled.p`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 100;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 5px;
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
  const [essayText, setEssayText] = useState<string>('Write your essay here.');
  const [essaySubject, setEssaySubject] = useState<string>('');

  const wordCount = essayText.split(' ').filter((word) => word).length;
  const isOverLetterLimit = essayText.length > MAX_LETTERS;
  const isOverLimit = wordCount > MAX_WORDS;
  const isLessLimit = wordCount < MIN_WORDS;

  const updateSubject = (subject: string) => {
    setEssaySubject(subject);
  };

  updateSubject('The Impact of Technology on Education');

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayText(e.target.value);
  };

  const handleSubmit = () => {
    // 제출 로직 (서버로 전송 등)
    if (!isLessLimit && !isOverLimit && !isOverLetterLimit)
      console.log('Essay Submitted:', essaySubject, essayText);
    else console.log('Check Letter Length. Too less or Too much:', essayText);
  };

  return (
    <Wrapper>
      <SubjectInfo>Write an essay about the subject below.</SubjectInfo>
      <SubjectText>{essaySubject}</SubjectText>
      <BeforeTextArea>
        <WordCount $isOverLimit={isOverLimit}>
          {wordCount}/{MAX_WORDS} words
        </WordCount>
      </BeforeTextArea>
      <TextArea
        value={essayText}
        onChange={handleTextChange}
        $isOverLimit={isOverLimit}
      />
      <Tip>Tip: Make sure your essay is concise and well-structured.</Tip>
      <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
    </Wrapper>
  );
};

export default Subject;
