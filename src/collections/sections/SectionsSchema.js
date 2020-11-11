import gql from "graphql-tag";

export const RETRIEVE_BY_ID = gql`
query SectionByID($id: Int!) {
    sectionById(id: $id) {
        id,
        contents,
        sectionsBySectionId(orderBy: SORTING_ASC) {
            nodes {
                id
            }
        }
    }
}
`;