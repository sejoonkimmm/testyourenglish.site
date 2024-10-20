import React, { useState } from 'react';
import styled from 'styled-components';
import useTopicStore from '../store/useTopicStore';
import submitEssay from '../api/submitEssay';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 33px;
`;

const Description = styled.p`
  font-size: 1.3rem;
  font-weight: 200;
  letter-spacing: 0.01rem;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0;
  margin-bottom: 30px;
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 800px;
  height: 200px;
  padding: 15px;
  font-size: 1rem;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  resize: vertical;
  margin: 0;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
`;

const WordCount = styled.div`
  font-size: 0.8rem;
  color: #888;
  align-self: flex-end;
  margin: 0;
  margin-bottom: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  transition-duration: 0.3s;
  margin: 0;
  margin-bottom: 20px;
`;

const Result = styled.div`
  width: 100%;
  max-width: 800px;
  padding: 30px 20px 10px 20px;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background_darker};
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
`;

const ResultTitle = styled.div`
  font-weight: 600;
  letter-spacing: 0.01rem;
  margin-bottom: 0.5rem;
`;

const ResultText = styled.div`
  font-weight: 300;
  letter-spacing: 0.01rem;
  line-height: 1.4;
`;

const Home: React.FC = () => {
  const { topics, selectedTopicIndex } = useTopicStore();
  const currentTopic = topics[selectedTopicIndex] ?? null;

  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const wordCount = text.split(' ').filter((word) => word).length;

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!canSubmit || wordCount < 100 || wordCount > 250 || text.length < 1000 || text.length > 2500) {
      if (!canSubmit) {
        setError('You can submit again after 5 minutes.');
      } else {
        setError('Your submission must be between 100 to 250 words and 1000 to 2500 characters.');
      }
      return;
    }

    setIsSubmitting(true);
    setCanSubmit(false);

    const requestBody = {
      topic: currentTopic?.title,
      text: text,
    };

    try {
      const response = await submitEssay({ requestBody });
      setFeedback(
        `CEFR: ${response.CEFR}<br />IELTS: ${response.IELTS}<br /><br /><b>Feedback:</b><br />${response.feedback}<br /><br /><b>Grammar:</b><br />${response.grammar}<br /><br /><b>Improvements:</b><br />${response.improvements}<br /><br /><b>Vocabulary:</b><br />${response.vocabulary}`
      );
      setError('');

      setTimeout(() => {
        setCanSubmit(true);
        setFeedback('');
      }, 5 * 60 * 1000);
    } catch (error) {
      setError('Error: ' + (error instanceof Error ? error.message : JSON.stringify(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      {currentTopic && <Description>{currentTopic.description}</Description>}
      <Textarea
        placeholder="Write your essay here..."
        value={text}
        onChange={handleInputChange}
      />
      <WordCount>{wordCount} / 250 words</WordCount>
      <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>Submit</SubmitButton>
      {(feedback || error) && (
        <Result>
          {error && (
            <>
              <ResultTitle style={{ color: '#dc3545' }}>
                Failed:
              </ResultTitle>
              <ResultText>{error}</ResultText>
              <br />
            </>
          )}
          {feedback && (
            <>
              <ResultTitle style={{ color: '#28a745' }}>
                Your Feedback:
              </ResultTitle>
              <ResultText dangerouslySetInnerHTML={{ __html: feedback }} />
              <br />
            </>
          )}
        </Result>
      )}
    </Wrapper>
  );
};

export default Home;
