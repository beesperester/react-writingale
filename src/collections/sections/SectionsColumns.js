// react
import { useState, useEffect } from 'react';

// apollo
// import { useQuery, gql } from '@apollo/client';

// app
import { RETRIEVE, FRAGMENT_SECTION } from './SectionsSchema';
import client from '../../client';

export const Section = ({ section }) => {
    return (
        <div className="card section">

            <div className="card-body">

                <p>{section.contents}</p>

            </div>

        </div>
    );
};

export const retrieveRecursively = async (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        try {
            // test if fragment is in cache
    
            const cachedSection = client.readFragment({
                id: node.nodeId,
                fragment: FRAGMENT_SECTION
            });

            await retrieveRecursively(cachedSection.sectionsBySectionId.nodes);
        } catch(e) {
            // load missing fragment
    
            console.info(`load fragment for ${node.nodeId}`);
    
            const result = await client.query({
                query: RETRIEVE,
                variables: {
                    nodeId: node.nodeId
                }
            });

            await retrieveRecursively(result.data.section.sectionsBySectionId.nodes);
    
            // write missing fragment to cache
    
            client.writeFragment({
                id: node.nodeId,
                fragment: FRAGMENT_SECTION,
                data: result.data.section
            });
        }
    }
};

export const buildColumns = (nodes, columns, depth) => {
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
}

const useSections = (nodes) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        retrieveRecursively(nodes).then(() => {
            setLoaded(true);
        }).catch(reason => {
            console.error(reason);
        })

        return () => {};
    });

    return loaded;
}

export const Sections = ({ article }) => {
    // const [columns, setColumns] = useState([[]]);

    const loaded = useSections(article.sectionsByArticleId.nodes);

    if (!loaded) return <p>Loading...</p>;

    // console.log(client.cache.data.data);


    // build columns from sections
    const columns = buildColumns(article.sectionsByArticleId.nodes, [], 0);
    // const columns = [];

    return (
        <div className="d-flex">

            {columns.map((rows, index) => (
                <div key={index} className="column flex-grow-1">
                    
                    {rows.map(node => <Section key={node.nodeId} section={node}/>)}
                
                </div>
                
            ))}

        </div>
    );
};

export default Sections;