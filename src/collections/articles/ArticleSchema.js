import { gql } from '@apollo/client';

export const FRAGMENT_ARTICLE = gql`
fragment articleFragment on Article {
    nodeId
    id
    name
    sectionsByArticleId(orderBy:SORTING_ASC) {
        nodes {
            nodeId
        }      
    }
}
`;

export const RETRIEVE_ALL = gql`
{
    allArticles {
        nodes {
            ...articleFragment
        }
    }
}
${FRAGMENT_ARTICLE}
`;

export const RETRIEVE = gql`
query Article($nodeId: ID!) {
    article(nodeId: $nodeId) {
        ...articleFragment
    }
}
${FRAGMENT_ARTICLE}
`;

export const CREATE = gql`
mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
        article {
            ...articleFragment
        }
    }
}
${FRAGMENT_ARTICLE}
`;

export const UPDATE = gql`
mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
        article {
            ...articleFragment
        }
    }
}
${FRAGMENT_ARTICLE}
`;

export const DELETE = gql`
mutation DeleteArticle($input: DeleteArticleInput!) {
    deleteArticle(input: $input) {
        article {
            ...articleFragment
        }
    }
}
${FRAGMENT_ARTICLE}
`;