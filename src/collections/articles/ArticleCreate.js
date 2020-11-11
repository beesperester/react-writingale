// apollo
import { useMutation } from '@apollo/react-hooks';

// bootstrap
import { Plus } from 'react-bootstrap-icons';

// app
import { RETRIEVE_ALL, CREATE } from './ArticleSchema';

export const ArticleCreate = () => {
    let input;

    const [createArticle] = useMutation(CREATE, {
        update(cache, { data }) {
            const { allArticles } = cache.readQuery({
                query: RETRIEVE_ALL
            })

            cache.writeQuery({
                query: RETRIEVE_ALL,
                data: {
                    allArticles: {
                        ...allArticles,
                        nodes: [
                            ...allArticles.nodes,
                            data.createArticle.article
                        ]
                    }
                }
            })
        }
    });

    return (
        <div>
            <form
                className="form-inline"
                onSubmit={e => {
                    e.preventDefault();

                    if (!input.value) return;

                    createArticle({
                        variables: {
                            input: {
                                article: {
                                    name: input.value
                                }
                            }
                        }
                    });
                    input.value = '';
                }}
            >
                <div className="form-group">

                    <label htmlFor="article-name">Name</label>

                    <input
                        name="article-name"
                        className="form-control mx-2"
                        ref={node => {
                            input = node;
                        }}
                    />
                
                </div>

                <button type="submit" className="btn btn-success">
                    
                    <Plus />Create
                    
                </button>

            </form>
        </div>
    );
};

export default ArticleCreate;