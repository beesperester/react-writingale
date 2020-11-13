// apollo
import { useMutation } from '@apollo/client';

// bootstrap
import { Plus } from 'react-bootstrap-icons';

// app
import { RETRIEVE as RETRIEVE_ARTICLE } from '../articles/ArticleSchema';
import { RETRIEVE, CREATE } from './SectionsSchema';

export const SectionCreate = ({ article }) => {
    const [createSection] = useMutation(CREATE, {
        update(cache, { data }) {
            const result = cache.readQuery({
                query: RETRIEVE_ARTICLE,
                variables: {
                    nodeId: article.nodeId
                }
            });

            cache.writeQuery({
                query: RETRIEVE_ARTICLE,
                data: {
                    article: {
                        ...result.article,
                        sectionsByArticleId: {
                            ...result.article.sectionsByArticleId,
                            nodes: [
                                ...result.article.sectionsByArticleId.nodes,
                                data.createSection.section
                            ]
                        }
                    }
                }
            });
        }
    });

    return (
        <div>
            <form
                className="form-inline"
                onSubmit={e => {
                    e.preventDefault();

                    createSection({
                        variables: {
                            input: {
                                section: {
                                    articleId: article.id,
                                    sorting: article.sectionsByArticleId.nodes.length
                                }
                            }
                        }
                    });
                }}
            >
                
                <button type="submit" className="btn btn-success">
                    
                    <Plus />Create
                    
                </button>

            </form>
        </div>
    );
};

export default SectionCreate;