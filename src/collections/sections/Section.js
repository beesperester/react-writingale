// apollo
import { useQuery } from '@apollo/react-hooks';

// app
import { RETRIEVE } from './SectionsSchema';

export const Section = ({ section }) => {
    const { loading, error, data } = useQuery(RETRIEVE, {
        variables: {
            nodeId: section.nodeId
        }
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="section">

            <p>{data.section.contents}</p>

            {data.section.sectionsBySectionId.nodes.map(node => (
                <Section key={node.id} section={node} />
            ))}

        </div>
    );
};

export default Section;