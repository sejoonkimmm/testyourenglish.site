import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const PannelWrapper = styled.div`
  height: 100%;
`;

const PanelHeader = styled.div`
  height: 45px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.panelBackground};
`;

const PanelContent = styled.div`
  height: calc(100% - 45px);
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SubjectText = styled.h2`
  margin-bottom: 20px;
`;

const TextArea = styled.textarea<{ $isOverLimit: boolean }>`
  width: 100%;
  height: calc(100vh - 400px); /* 제출 버튼과 팁에 맞춰 높이를 조정 */
  padding: 10px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  resize: none;
  font-size: 1.3rem;
  border: ${({ $isOverLimit }) =>
    $isOverLimit
      ? '2px solid red'
      : '1px solid ${({ theme }) => theme.colors.text}'};
`;

const LetterCount = styled.p<{ $isOverLimit: boolean }>`
  color: ${({ $isOverLimit, theme }) =>
    $isOverLimit ? 'red' : theme.colors.text};
  font-size: 1.3rem;
  font-weight: 100;
  text-align: right;
`;

const Tip = styled.p`
  margin-top: 0.5rem;
  font-size: 1.3rem;
  font-weight: 100;
  color: ${({ theme }) => theme.colors.secondary};
`;

const SubmitButton = styled(Button)`
  width: 20%;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 15px;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.background};
`;

const MAX_LETTERS = 500; // 문자 수 제한

const Subject: React.FC = () => {
  const [essayText, setEssayText] = useState('');
  const navigate = useNavigate();
  const letterCount = essayText.length; // 문자 수 계산
  const isOverLimit = letterCount > MAX_LETTERS; // 문자 수 제한 체크

  const handleSubjectClick = () => {
    navigate('/');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEssayText(e.target.value);
  };

  const handleSubmit = () => {
    // 제출 로직 (서버로 전송 등)
    console.log('Essay Submitted:', essayText);
  };

  return (
    <PannelWrapper>
      <PanelHeader>
        <Button onClick={handleSubjectClick}>Subject</Button>
        <Button onClick={handleHistoryClick}>History</Button>
      </PanelHeader>
      <PanelContent>
        <SubjectText>
          Write an essay about the "The Impact of Technology on Education".
        </SubjectText>
        <Tip>Tip: Make sure your essay is concise and well-structured.</Tip>
        <LetterCount $isOverLimit={isOverLimit}>
          {letterCount}/{MAX_LETTERS} letters
        </LetterCount>
        <TextArea
          value={essayText}
          onChange={handleTextChange}
          $isOverLimit={isOverLimit}
        />
        <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
      </PanelContent>
    </PannelWrapper>
  );
};

export default Subject;
