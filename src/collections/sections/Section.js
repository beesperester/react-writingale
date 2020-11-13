// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/client';

// app
import { FRAGMENT_ARTICLE } from '../articles/ArticleSchema';
import { CREATE, FRAGMENT_SECTION } from './SectionsSchema';

const sortNodes = (a, b) => {
    return a.sorting - b.sorting;
};

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

    const [createSiblingSection] = useMutation(CREATE, {
        update(cache, { data }) {
            const createdSection = data.createSection.section;

            if (section.sectionId) {
                // update parent section
                const id = section.sectionBySectionId.nodeId;

                const cachedSection = cache.readFragment({
                    id,
                    fragment: FRAGMENT_SECTION
                });
                
    
                cache.writeFragment({
                    id,
                    fragment: FRAGMENT_SECTION,
                    data: {
                        sectionsBySectionId: {
                            ...cachedSection.sectionsBySectionId,
                            nodes: [
                                ...cachedSection.sectionsBySectionId.nodes,
                                createdSection
                            ].sort(sortNodes)
                        }
                    }
                });
            }
            
            if (section.articleId) {
                // update parent article
                const id = section.articleByArticleId.nodeId;

                const cachedArticle = cache.readFragment({
                    id,
                    fragment: FRAGMENT_ARTICLE
                });

                cache.writeFragment({
                    id,
                    fragment: FRAGMENT_ARTICLE,
                    data: {
                        sectionsBySectionId: {
                            ...cachedArticle.sectionsBySectionId,
                            nodes: [
                                ...cachedArticle.sectionsBySectionId.nodes,
                                createdSection
                            ].sort(sortNodes)
                        }
                    }
                });
            }

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
                <div className="section-tools">

                    <div className="section-action-previous">

                        <button 
                            className="btn btn-secondary"
                            onClick={e => {
                                e.preventDefault();

                                createSiblingSection({
                                    variables: {
                                        input: {
                                            section: {
                                                sectionId: section.sectionId ? section.sectionId : undefined,
                                                articleId: section.articleId ? section.articleId : undefined,
                                                sorting: section.sorting - 1
                                            }
                                        }
                                    }
                                })
                            }}
                        >
                            Add
                            
                        </button>

                    </div>

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

                    <div className="section-action-next">

                        <button 
                            className="btn btn-secondary"
                            onClick={e => {
                                e.preventDefault();

                                createSiblingSection({
                                    variables: {
                                        input: {
                                            section: {
                                                sectionId: section.sectionId ? section.sectionId : undefined,
                                                articleId: section.articleId ? section.articleId : undefined,
                                                sorting: section.sorting + 1
                                            }
                                        }
                                    }
                                })
                            }}
                        >
                            Add
                            
                        </button>

                    </div>

                </div>
            ) : undefined}

        </div>
    );
};

export default Section;