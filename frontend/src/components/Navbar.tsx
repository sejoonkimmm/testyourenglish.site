import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Refresh } from '@styled-icons/evaicons-solid/Refresh';
import { List } from '@styled-icons/evaicons-solid/List';
import { CheckSquareFill } from '@styled-icons/bootstrap/CheckSquareFill';
import { ExclamationTriangleFill } from '@styled-icons/bootstrap/ExclamationTriangleFill';
import useTopicStore from '../store/useTopicStore';

const NavbarWrapper = styled.nav`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background: none;
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.p`
  font-size: 1rem;
  font-weight: 300;
  color: ${({ theme }) => theme.colors.text};
`;

const TitleLink = styled.a`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  text-decoration-line: none;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  transition-duration: 0.3s;
`;

const RefreshIcon = styled(Refresh)`
  color: ${({ theme }) => theme.colors.text};
  width: 24px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  transition-duration: 0.3s;
`;

const ListIcon = styled(List)`
  color: ${({ theme }) => theme.colors.text};
  width: 24px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  transition-duration: 0.3s;
  margin-left: 10px;
`;

const ErrorMessageContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 20px;
  width: auto;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background_darker};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  color: ${({ theme }) => theme.colors.failure};
`;

const CheckIcon = styled(CheckSquareFill)`
  color: ${({ theme }) => theme.colors.success};
`;

const ExclamationIcon = styled(ExclamationTriangleFill)`
  color: ${({ theme }) => theme.colors.failure};
`;

const TopicListContainer = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  width: 330px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background_darker};
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const TopicItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TopicDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopicTitle = styled.strong`
  font-weight: bold;
`;

const TopicScore = styled.p`
  font-size: 0.9rem;
  margin: 5px 0 0;
  color: ${({ theme }) => theme.colors.text};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const LastUpdated = styled.p`
  font-size: 0.8rem;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Navbar: React.FC = () => {
  const { refreshTopics, topics, selectedTopicIndex, lastUpdated } = useTopicStore();
  const [isTopicListVisible, setTopicListVisible] = useState(false);
  const [isErrorMessageVisible, setErrorMessageVisible] = useState(false);
  const currentTopic = topics[selectedTopicIndex] ?? null;
  const pageName = currentTopic?.title ? currentTopic?.title : 'error';

  const handleRefresh = (): void => {
    if (currentTopic && !currentTopic.isSolved) {
      setErrorMessageVisible(true);
    } else {
      refreshTopics();
    }
  };

  const toggleTopicList = (): void => {
    setTopicListVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('#topic-list-container') && isTopicListVisible) {
        setTopicListVisible(false);
      }
      if (!target.closest('#error-message-container') && isErrorMessageVisible) {
        setErrorMessageVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isTopicListVisible, isErrorMessageVisible]);

  return (
    <NavbarWrapper>
      <Title>
        <TitleLink href="/">test your english</TitleLink> / {pageName}
      </Title>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isErrorMessageVisible && (
          <ErrorMessageContainer id="error-message-container">
            Solve all topics before refreshing.
          </ErrorMessageContainer>
        )}
        <RefreshIcon onClick={handleRefresh} />
        <ListIcon onClick={toggleTopicList} />
      </div>
      {isTopicListVisible && (
        <TopicListContainer id="topic-list-container">
          {topics.map((topic, index) => (
            <TopicItemWrapper key={index}>
              <TopicDetails>
                <TopicTitle>{topic.title}</TopicTitle>
                <TopicScore>
                  CEFR: {topic.cefrScore ?? 'N/A'}, IELTS: {topic.ieltsScore ?? 'N/A'}
                </TopicScore>
              </TopicDetails>
              {topic.isSolved ? (
                <CheckIcon size={24} />
              ) : (
                <ExclamationIcon size={24} />
              )}
            </TopicItemWrapper>
          ))}
          <LastUpdated>Last updated: {lastUpdated}</LastUpdated>
        </TopicListContainer>
      )}
    </NavbarWrapper>
  );
};

export default Navbar;
