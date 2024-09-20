import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'; // 추가
import styled from 'styled-components';
import articles from './_articles';

const ArticleWrapper = styled.div`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0;
`;

const ArticleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ArticleIcon = styled.div`
  font-size: 2.5rem;
`;

const ArticleTitle = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

const ArticleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ArticleDate = styled.div`
  font-size: 0.9rem;
  font-weight: 100;
  text-align: right;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 20px;
`;

const ArticleDescription = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  font-weight: 200;
`;

const ArticleContent = styled.div`
  line-height: 1.8;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Hr = styled.hr`
  width: 70%;
  margin: 1rem auto;
  color: ${({ theme }) => theme.colors.text};

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <ArticleWrapper>
      <ArticleHeader>
        <ArticleIcon>{article.icon}</ArticleIcon>
        <ArticleInfo>
          <ArticleTitle>{article.title}</ArticleTitle>
          <ArticleDescription>{article.description}</ArticleDescription>
        </ArticleInfo>
      </ArticleHeader>
      <ArticleDate>{article.date}</ArticleDate>
      <Hr />
      <ArticleContent>
        <ReactMarkdown>{article.content}</ReactMarkdown> {/* Markdown 렌더링 */}
      </ArticleContent>
    </ArticleWrapper>
  );
};

export default ArticleDetail;
