import gql from "graphql-tag";

export const RETRIEVE_ALL = gql`
{
    allArticles {
        nodes {
            nodeId
            name
        }
    }
}
`;

export const RETRIEVE = gql`
query ArticleByID($id: Int!) {
    articleById(id: $id) {
        nodeId
        name
        sectionsByArticleId(orderBy:SORTING_ASC) {
            nodes {
                nodeId
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
            name
        }
    }
}
`;