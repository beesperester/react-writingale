// react
import { useState } from 'react';

// app
import { FRAGMENT_SECTION } from './SectionsSchema';
import client from '../../client';
import { useSections } from './sectionsHooks';
import Section from './Section';
import SectionCreate from './SectionCreate';

const buildColumns = (nodes, columns, depth) => {
    nodes.forEach(node => {
        const cachedSection = client.readFragment({
            id: node.nodeId,
            fragment: FRAGMENT_SECTION
        });
        
        if (columns.length < depth + 1) {
            for (let i = 0; i < (depth + 1) - columns.length; i++) {
                columns.push([]);
            }
        }

        columns[depth].push(cachedSection);

        buildColumns(cachedSection.sectionsBySectionId.nodes, columns, depth + 1);
    })

    return columns;
};

export const Sections = ({ article }) => {
    const [activeNodeId, setActiveNodeId] = useState(false);

    const { loading, error } = useSections(article.sectionsByArticleId.nodes);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log(client.cache.data.data);


    // build columns from sections
    const columns = buildColumns(article.sectionsByArticleId.nodes, [], 0);

    return (
        <div>

            <SectionCreate article={article} />

            <div className="columns d-flex">

                {columns.map((rows, index) => (
                    <div key={index} className="column flex-fill">
                        
                        {rows.map(node => <Section key={node.nodeId} section={node} activeNodeId={activeNodeId} setActiveNodeId={setActiveNodeId}/>)}
                    
                    </div>
                    
                ))}

            </div>

        </div>
    );
};

export default Sections;