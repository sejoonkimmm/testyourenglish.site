// ---------------------------––----------------------------------------------
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import TopicInterface from '../interface/TopicInterface';

// ---------------------------––----------------------------------------------
const Wrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
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
  font-size: 1.2rem;
  font-weight: 800;
  width: 20%;
  font-size: 1.5rem;
  font-weight: 600;
  padding: 15px;
  margin-top: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

const FeedbackMessage = styled.p`
  font-size: 1.2rem;
  color: red;
  margin-top: 20px;
`;

const MIN_LETTERS = 1000;
const MAX_LETTERS = 2500;
const MAX_WORDS = 250;

const Subject: React.FC = () => {
  // ---------------------------––----------------------------------------------
  // Text
  const [text, setText] = useState<string>('Write your essay here.');
  const wordCount = text.split(' ').filter((word) => word).length;
  const isToLess = text.length > MIN_LETTERS;
  const isOverLetterLimit = text.length > MAX_LETTERS;
  const isOverLimit = wordCount > MAX_WORDS;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // ---------------------------––----------------------------------------------
  // Topic
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<TopicInterface>({
    title: 'Descriptive Writing',
    description:
      'Write a detailed description of your favorite place, including sensory details that evoke sights, sounds, smells, tastes, and textures.',
  });
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true); // 로딩 시작
      setError(null); // 오류 초기화

      try {
        const response = await fetch(
          'https://we6jyg97u7.execute-api.eu-central-1.amazonaws.com/prod/topics',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ key: 'value' }),
          }
        );

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Object에서 각 topic들을 배열로 변환
        const topics: TopicInterface[] = Object.values(data);

        // 랜덤하게 하나의 topic 선택
        const index: number = Math.floor(Math.random() * topics.length);
        const randomTopic: TopicInterface = {
          title: topics[index].title,
          description: topics[index].description,
        };

        setTopic(randomTopic);
      } catch (error) {
        setError(
          'Failed to fetch topics. Please check the console error and try again later.'
        );
        console.error('Error fetching topics:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchTopics();
  }, []);

  // ---------------------------––----------------------------------------------
  // Submit
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // 제출 중 상태
  const [feedback, setFeedback] = useState<string | null>(null); // 서버 응답 메시지
  const [canSubmit, setCanSubmit] = useState<boolean>(true); // 제출 가능 여부
  const handleSubmit = async () => {
    if (!canSubmit || isOverLimit || isOverLetterLimit || !isToLess) {
      if (!canSubmit) {
        setFeedback('You can submit again after 5 minutes.');
      } else {
        setFeedback('Check Letter Length. 1000 ~ 2500 letters allowed.');
      }
      return;
    }

    setIsSubmitting(true); // 제출 중으로 설정
    setCanSubmit(false); // 제출 비활성화

    const requestBody = {
      topic: topic.title,
      text: text,
    };

    try {
      const response = await fetch(
        'https://we6jyg97u7.execute-api.eu-central-1.amazonaws.com/prod/check',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        // 서버의 응답이 JSON인지 아닌지 확인 후 적절히 처리
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || 'Unknown error occurred.');
        } catch {
          // JSON 형식이 아닐 경우 텍스트 그대로 오류 메시지 설정
          throw new Error(errorText);
        }
      }

      const result = await response.json();
      setFeedback(
        `Submission successful. CEFR: ${result.CEFR}, IELTS: ${result.IELTS}, FEEDBACK: ${result.feedback}`
      );

      // 5분 후 다시 제출 가능하게 설정
      setTimeout(
        () => {
          setCanSubmit(true);
          setFeedback(null); // 메시지 초기화
        },
        5 * 60 * 1000
      ); // 5분 = 300000ms
    } catch (error) {
      setFeedback(
        'Error: ' +
          (error instanceof Error ? error.message : JSON.stringify(error))
      );
      console.error('Error submitting essay:', error);
    } finally {
      setIsSubmitting(false); // 제출 중 상태 해제
    }
  };

  // ---------------------------––----------------------------------------------
  // Return
  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else {
    content = (
      <>
        <SubjectInfo>{topic.title}</SubjectInfo>
        <SubjectText>{topic.description}</SubjectText>
        <WordCount $isOverLimit={isOverLimit}>
          {wordCount}/{MAX_WORDS} words
        </WordCount>
        <TextArea
          value={text}
          onChange={handleTextChange}
          $isOverLimit={isOverLimit}
        />
        <Tip>Tip: Make sure your essay is concise and well-structured.</Tip>
        {feedback && <FeedbackMessage>{feedback}</FeedbackMessage>}
        <SubmitButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </SubmitButton>
      </>
    );
  }
  return <Wrapper>{content}</Wrapper>;
};

export default Subject;
