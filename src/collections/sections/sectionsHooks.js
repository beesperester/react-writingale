// react
import { useState, useEffect } from 'react';

// app
import { RETRIEVE, FRAGMENT_SECTION } from './SectionsSchema';
import client from '../../client';

const retrieveRecursively = async (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        try {
            // test if fragment is in cache
            const cachedSection = client.readFragment({
                id: node.nodeId,
                fragment: FRAGMENT_SECTION
            });

            // retrieve nested sections
            await retrieveRecursively(cachedSection.sectionsBySectionId.nodes);
        } catch(e) {
            // load missing fragment    
            const result = await client.query({
                query: RETRIEVE,
                variables: {
                    nodeId: node.nodeId
                }
            });

            // retrieve nested sections
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

export const useSections = (nodes) => {
    const [state, setState] = useState({
        started: false,
        loading: true,
        error: false
    });

    if (!state.started && state.loading) {
        setState({
            ...state,
            started: true
        });

        retrieveRecursively(nodes).then(() => {
            console.log('done loading');
    
            setState({
                ...state,
                loading: false
            });
        }).catch(reason => {
            console.error(reason);
        });
    }

    return state;
};