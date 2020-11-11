// apollo
import { useQuery } from '@apollo/react-hooks';

// app
import { RETRIEVE_BY_ID } from './SectionsSchema';

export const Section = ({ id }) => {
    const { loading, error, data } = useQuery(RETRIEVE_BY_ID, {
        variables: {
            id: id
        }
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="section">

            <p>{data.sectionById.contents}</p>

            {data.sectionById.sectionsBySectionId.nodes.map(node => (
                <Section key={node.id} id={node.id} />
            ))}

        </div>
    );
};

export default Section;