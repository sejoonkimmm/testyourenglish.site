import styled, { css } from 'styled-components';
import ArticleInterface from '../../interface/ArticleInterface';

const ArticleListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin: 0 auto;
  margin-top: 32px;

  overflow-y: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* Desktop View */
  @media (min-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: calc(100vh - 20vh);
  }

  /* Mobile View */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: calc(100vh - 320px);
  }
`;

const ArticleItem = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: left;
  max-width: 100%;
`;

const ArticleIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 3rem - 16px);
`;

const ArticleContentCommonStyle = css`
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  width: 100%;
`;

const ArticleTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
  ${ArticleContentCommonStyle}
`;

const ArticleDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.secondary};
  margin-top: 4px;
  ${ArticleContentCommonStyle}
`;

const ArticleList: React.FC<{
  articleList: ArticleInterface[];
  onArticleClick: (articleId: string) => void;
}> = ({ articleList, onArticleClick }) => {
  return (
    <ArticleListWrapper>
      {articleList.map((article, index) => (
        <ArticleItem key={index} onClick={() => onArticleClick(article.id)}>
          <ArticleIcon>{article.icon}</ArticleIcon>
          <ArticleContent>
            <ArticleTitle>{article.title}</ArticleTitle>
            <ArticleDescription>{article.description}</ArticleDescription>
          </ArticleContent>
        </ArticleItem>
      ))}
    </ArticleListWrapper>
  );
};

export default ArticleList;
