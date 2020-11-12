import gql from "graphql-tag";

export const RETRIEVE_ALL = gql`
{
    allArticles {
        nodes {
            nodeId
            id
            name
        }
    }
}
`;

export const RETRIEVE = gql`
query Article($nodeId: ID!) {
    article(nodeId: $nodeId) {
        nodeId
        id
        name
        sectionsByArticleId(orderBy:SORTING_ASC) {
            nodes {
                nodeId
                id
                contents
            }      
        }
    }
}
`;

export const CREATE = gql`
mutation CreateArticle($input: CreateArticleInput!) {
    createArticle(input: $input) {
        article {
            nodeId
            id
            name
        }
    }
}
`;

export const UPDATE = gql`
mutation UpdateArticle($input: UpdateArticleInput!) {
    updateArticle(input: $input) {
        article {
            nodeId
            id
            name
        }
    }
}
`;

export const DELETE = gql`
mutation DeleteArticle($input: DeleteArticleInput!) {
    deleteArticle(input: $input) {
        article {
            nodeId
            id
            name
        }
    }
}
`;