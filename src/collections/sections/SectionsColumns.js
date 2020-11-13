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

const findParents = (section) => {
    let parents = [];

    if (section.sectionBySectionId && section.sectionBySectionId.nodeId) {
        parents.push(section.sectionBySectionId.nodeId);

        const cachedParentSection = client.cache.readFragment({
            id: section.sectionBySectionId.nodeId,
            fragment: FRAGMENT_SECTION
        });

        parents = parents.concat(findParents(cachedParentSection));
    }

    return parents;
}

export const Sections = ({ article }) => {
    const [activeNodes, setActiveNodes] = useState({
        leaf: undefined,
        parents: []
    });

    const setActiveNode = (node) => {
        setActiveNodes({
            leaf: node.nodeId,
            parents: findParents(node)
        })
    };

    const { loading, error } = useSections(article.sectionsByArticleId.nodes);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    // build columns from sections
    const columns = buildColumns(article.sectionsByArticleId.nodes, [], 0);

    return (
        <div>

            <SectionCreate article={article} setActiveNode={setActiveNode} />

            <div className="columns d-flex">

                {columns.map((rows, index) => (
                    <div key={index} className="column flex-fill">
                        
                        {rows.map(node => 
                            <Section 
                                key={node.nodeId} 
                                section={node}
                                isActive={activeNodes.leaf === node.nodeId || activeNodes.parents.includes(node.nodeId)}
                                isLeaf={activeNodes.leaf === node.nodeId}
                                // activeNodeId={activeNodeId} 
                                setActiveNode={setActiveNode}
                            />
                        )}
                    
                    </div>
                    
                ))}

            </div>

        </div>
    );
};

export default Sections;