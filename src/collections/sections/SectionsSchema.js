import { gql } from '@apollo/client';

export const FRAGMENT_SECTION = gql`
fragment sectionFragment on Section {
    nodeId
    id
    contents
    sorting
    sectionId
    articleId
    sectionBySectionId {
        nodeId
    }
    articleByArticleId {
        nodeId
    }
    sectionsBySectionId(orderBy: SORTING_ASC) {
        nodes {
            nodeId
        }
    }
}
`;

export const RETRIEVE = gql`
query Section($nodeId: ID!) {
    section(nodeId: $nodeId) {
        ...sectionFragment
    }
}

${FRAGMENT_SECTION}
`;

export const CREATE = gql`
mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
        section {
            ...sectionFragment
        }
    }
}

${FRAGMENT_SECTION}
`;