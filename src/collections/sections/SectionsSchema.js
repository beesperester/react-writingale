import gql from "graphql-tag";

export const RETRIEVE = gql`
query Section($nodeId: ID!) {
    section(nodeId: $nodeId) {
        nodeId
        id
        contents
        sectionsBySectionId(orderBy: SORTING_ASC) {
            nodes {
                nodeId
                id
                contents
            }
        }
    }
}
`;