// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/client';

// app
import client from '../../client';
import { RETRIEVE, CREATE, FRAGMENT_SECTION } from './SectionsSchema';

const findParents = (section, parents) => {
    if (section.sectionBySectionId && section.sectionBySectionId.nodeId) {
        parents.push(section.sectionBySectionId.nodeId);

        const cachedParentSection = client.cache.readFragment({
            id: section.sectionBySectionId.nodeId,
            fragment: FRAGMENT_SECTION
        });

        findParents(cachedParentSection, parents);
    }
}

export const Section = ({ section, isActive, isLeaf, setActiveNodeId, setActiveParentIds }) => {
    const [createChildSection] = useMutation(CREATE, {
        update(cache, { data }) {
            const createdSection = data.createSection.section;
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
                            createdSection
                        ]
                    }
                }
            });

            setActiveNodeId(createdSection.nodeId);

            const parents = [];

            findParents(createdSection, parents);

            setActiveParentIds(parents);
        }
    });

    return (
        <div 
            className={`card section ${isActive ? 'section-active': ''}`}
            onClick={e => {
                e.preventDefault();

                setActiveNodeId(section.nodeId);

                const parents = [];

                findParents(section, parents);

                setActiveParentIds(parents);
            }}
        >

            <div className="card-body">

                <p>{section.contents}</p>

            </div>

            {isLeaf ? (
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