// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/client';

// app
import { CREATE, FRAGMENT_SECTION } from './SectionsSchema';

export const Section = ({ section, isActive, isLeaf, setActiveNode }) => {
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

            setActiveNode(createdSection);
        }
    });

    return (
        <div 
            className={`card section ${isActive ? 'section-active': ''}`}
            onClick={e => {
                e.preventDefault();

                setActiveNode(section);
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