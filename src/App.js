import './App.css';
import React from 'react';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { Mutation, Query } from 'react-apollo';
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
`;

const CREATE_ARTICLE = gql`
mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    article {
      id,
      name
    }
  }
}
`;

const UPDATE_ARTICLE = gql`
mutation UpdateArticle($input: UpdateArticleByIdInput!) {
  updateArticleById(input: $input) {
    article {
      id, name
    }
  }
}
`;

const DELETE_ARTICLE = gql`
mutation DeleteArticle($input: DeleteArticleByIdInput!) {
  deleteArticleById(input: $input) {
    article {
      id,
      name
    }
  }
}
`;

const CreateArticle = () => {
  let input;

  return (
    <Mutation 
      mutation={CREATE_ARTICLE}
      update={(cache, {data}) => {
        const { allArticles } = cache.readQuery({
          query: GET_ARTICLES
        });

        cache.writeQuery({
          query: GET_ARTICLES,
          data: {
            allArticles: {
              nodes: [
                ...allArticles.nodes,
                data.createArticle.article
              ]
            }
          }
        })
      }}
    >
      {createArticle => (
        <div>
          <form
            onSubmit={e => {
              e.preventDefault();

              if (!input.value) return;

              createArticle({
                variables: {
                  input: {
                    article: {
                      name: input.value
                    }
                  }
                }
              });
              input.value = '';
            }}
          >
            <input
              ref={node => {
                input = node;
              }}
            />

            <button type="submit">Create</button>

          </form>
        </div>
      )}
    </Mutation>
  )
}

const UpdateArticle = ({id, name}) => {
  let input;

  return (
    <Mutation
      mutation={UPDATE_ARTICLE}
    >
      {updateArticle => (
        <form
          onSubmit={e => {
            e.preventDefault();

            if (!input.value) return;

            updateArticle({
              variables: {
                input: {
                  id: id,
                  articlePatch: {
                    name: input.value
                  }
                }
              }
            });

            input.value = '';
          }}
        >

          <input
            ref={node => {
              input = node;
            }}
          />

          <button type="submit">Update</button>

        </form>
      )}
    </Mutation>
  )
}

const DeleteArticle = ({id}) => {
  return (
    <Mutation
      mutation={DELETE_ARTICLE}
      update={(cache, {data}) => {
        const { allArticles } = cache.readQuery({
          query: GET_ARTICLES
        });

        cache.writeQuery({
          query: GET_ARTICLES,
          data: {
            allArticles: {
              nodes: [
                ...allArticles.nodes.filter(article => article.id !== data.deleteArticleById.article.id)
              ]
            }
          }
        })
      }}
    >
      {deleteArticle => (
        <button
          onClick={e => {
            e.preventDefault();

            deleteArticle({
              variables: {
                input: {
                  id: id
                }
              }
            })
          }}
        >Delete</button>
      )}
    </Mutation>
  )
}

const App = () => {
  return (
    <React.Fragment>

      <CreateArticle />
        
      <Query query={GET_ARTICLES}>
        {({loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return data.allArticles.nodes.map(({id, name}) => (
            <div key={id}>
              <strong>{name}</strong>

              <UpdateArticle id={id} name={name} />

              <DeleteArticle id={id} />
            </div>
          )) 
        }}
      </Query>

    </React.Fragment>
  )
}

function AppOld() {
  const updateCache = (cache, {data}) => {
    const existingArticles = cache.readQuery({
      query: GET_ARTICLES
    });

    const newArticle = data.createArticle.article;
    cache.writeQuery({
      query: GET_ARTICLES,
      data: {
        allArticles: {
          nodes: [
            ...existingArticles,
            newArticle
          ]
        }
      }
    });
  }

  const { data, loading, error } = useQuery(GET_ARTICLES);
  const [createArticle] = useMutation(CREATE_ARTICLE, {update: updateCache});

  let input;

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <React.Fragment>

      <h1>Articles</h1>

      <form 
        onSubmit={e => {
          e.preventDefault();

          if (input.value) {
            createArticle({
              variables: {
                input: {
                  article: {
                    name: input.value
                  }
                }
              }
            });
          }          

          input.value = '';
        }}
      >

        <input
          ref={node => {
            input = node;
          }}
        />

        <button type="submit">Create</button>

      </form>

      {data && data.allArticles && data.allArticles.nodes.map((article, index) => (
        <div key={index}>
          {article.name}
        </div>
      ))}
    </React.Fragment>
  );
}

export default App;
