// react
import { useState } from 'react';

// app
import { FRAGMENT_SECTION } from './SectionsSchema';
import client from '../../client';
import { useSections } from './sectionsHooks';
import Section from './Section';
import SectionCreate from './SectionCreate';

const sortNodes = (a, b) => {    
    return a.sorting - b.sorting;
};

const buildColumns = (nodes, columns, depth) => {
    [...nodes].sort(sortNodes).forEach(node => {        
        if (columns.length < depth + 1) {
            for (let i = 0; i < (depth + 1) - columns.length; i++) {
                columns.push([]);
            }
        }

        columns[depth].push(node);

        buildColumns(node.sectionsBySectionId.nodes, columns, depth + 1);
    })

    return columns;
};

const buildTree = (nodes) => {
    return nodes.map(node => {
        const data = client.readFragment({
            id: node.nodeId,
            fragment: FRAGMENT_SECTION
        });

        return {
            ...data,
            sectionsBySectionId: {
                ...data.sectionsBySectionId,
                nodes: buildTree(data.sectionsBySectionId.nodes)
            }
        };
    });
}

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

    // read cache
    const tree = buildTree(article.sectionsByArticleId.nodes);

    // build columns from sections
    const columns = buildColumns(tree, [], 0);

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