// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/client';

// app
import { FRAGMENT_ARTICLE } from '../articles/ArticleSchema';
import { CREATE, FRAGMENT_SECTION } from './SectionsSchema';

const updateSiblings = cache => createdNode => nodes => {
    nodes.forEach(node => {
        const cachedNode = cache.readFragment({
            id: node.nodeId,
            fragment: FRAGMENT_SECTION
        });

        const sorting = cachedNode.sorting >= createdNode.sorting 
            ? cachedNode.sorting + 1 
            : cachedNode.sorting;                    

        cache.writeFragment({
            id: node.nodeId,
            fragment: FRAGMENT_SECTION,
            data: {
                sorting
            }
        });
    });    
}

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
                const id = section.sectionBySectionId.nodeId;

                // read parent section
                const cachedSection = cache.readFragment({
                    id,
                    fragment: FRAGMENT_SECTION
                });

                // update all siblings
                updateSiblings(cache)(createdSection)(cachedSection.sectionsBySectionId.nodes);              
                
                // update parent section
                cache.writeFragment({
                    id,
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
            }
            
            if (section.articleId) {
                const id = section.articleByArticleId.nodeId;

                // read parent section
                const cachedArticle = cache.readFragment({
                    id,
                    fragment: FRAGMENT_ARTICLE
                });

                // update all siblings
                updateSiblings(cache)(createdSection)(cachedArticle.sectionsByArticleId.nodes); 

                // update parent article
                cache.writeFragment({
                    id,
                    fragment: FRAGMENT_ARTICLE,
                    data: {
                        sectionsByArticleId: {
                            ...cachedArticle.sectionsByArticleId,
                            nodes: [
                                ...cachedArticle.sectionsByArticleId.nodes,
                                createdSection
                            ]
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

                <strong>{section.id}:{section.sorting}</strong>

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
                                                sorting: Math.max(section.sorting - 1, 0)
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