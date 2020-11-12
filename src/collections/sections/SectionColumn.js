// apollo
import { useQuery } from '@apollo/client';

// app
import { RETRIEVE } from './SectionsSchema';

export const SectionColumn = ({ section, accumulator }) => {
    const { loading, error, data } = useQuery(RETRIEVE, {
        variables: {
            nodeId: section.nodeId
        }
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    data.section.sectionsBySectionId.nodes.forEach(node => {
        accumulator(SectionColumn({
            section: node,
            accumulator: x => {}
        }));
    })

    return (
        <div className="section">

            <p>{data.section.contents}</p>

        </div>
    );
};

export default SectionColumn;