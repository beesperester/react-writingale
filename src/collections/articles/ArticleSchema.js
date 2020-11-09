import gql from "graphql-tag";

export const RETRIEVE_ALL = gql`
{
  allArticles{
    nodes{
      id,
      name
    }
  }
}
`;

export const CREATE = gql`
mutation CreateArticle($input: CreateArticleInput!) {
  createArticle(input: $input) {
    article {
      id,
      name
    }
  }
}
`;

export const UPDATE_BY_ID = gql`
mutation UpdateArticle($input: UpdateArticleByIdInput!) {
  updateArticleById(input: $input) {
    article {
      id, name
    }
  }
}
`;

export const DELETE_BY_ID = gql`
mutation DeleteArticle($input: DeleteArticleByIdInput!) {
  deleteArticleById(input: $input) {
    article {
      id,
      name
    }
  }
}
`;