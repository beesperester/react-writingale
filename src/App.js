import './App.css';
import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";

const GET_ARTICLES = gql`
{
  allArticles{
    nodes{
      id,
      name
    }
  }
}
`

function App() {
  const { data, loading, error } = useQuery(GET_ARTICLES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <React.Fragment>

      <h1>Articles</h1>
      
      {data && data.allArticles && data.allArticles.nodes.map((article, index) => (
        <div key={index}>
          {article.name}
        </div>
      ))}
    </React.Fragment>
  );
}

export default App;
