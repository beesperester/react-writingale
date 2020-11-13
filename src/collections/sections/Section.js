// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/client';

// app
import client from '../../client';
import { RETRIEVE, CREATE, FRAGMENT_SECTION } from './SectionsSchema';

export const Section = ({ section, activeNodeId, setActiveNodeId }) => {
    const isActive = activeNodeId === section.nodeId;

    const [createChildSection] = useMutation(CREATE, {
        update(cache, { data }) {
            const cachedSection = cache.readFragment({
                id: section.nodeId,
                fragment: FRAGMENT_SECTION
            });

            cache.writeFragment({
                id: section.nodeId,
                fragment: FRAGMENT_SECTION,
                data: {
                    sectionsBySectionId: {
                        ...cachedSection.sectionsBySectionId,
                        nodes: [
                            ...cachedSection.sectionsBySectionId.nodes,
                            data.createSection.section
                        ]
                    }
                }
            });

            setActiveNodeId(data.createSection.section.nodeId);
        }
    });

    return (
        <div 
            className={`card section ${isActive ? 'section-active': ''}`}
            onClick={e => {
                e.preventDefault();

                setActiveNodeId(section.nodeId);
            }}
        >

            <div className="card-body">

                <p>{section.contents}</p>

            </div>

            {isActive ? (
                <div className="section-action-child">

                    <button 
                        className="btn btn-secondary"
                        onClick={e => {
                            e.preventDefault();

                            createChildSection({
                                variables: {
                                    input: {
                                        section: {
                                            sectionId: section.id,
                                            sorting: section.sectionsBySectionId.nodes.length
                                        }
                                    }
                                }
                            })
                        }}
                    >
                        Add
                        
                    </button>

                </div>
            ) : undefined}

        </div>
    );
};

export default Section;