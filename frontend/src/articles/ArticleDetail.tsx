import React from 'react';
import { useParams } from 'react-router-dom';
import articles from './_articles';

const ArticleDetail: React.FC = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const article = articles.find((a) => a.id === articleId);

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <div>
      <h2>{article.title}</h2>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleDetail;
