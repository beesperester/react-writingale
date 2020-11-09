import { useMutation } from '@apollo/react-hooks';

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
                <input
                    ref={node => {
                        input = node;
                    }}
                />

                <button type="submit">Create</button>

            </form>
        </div>
    );
};

export default ArticleCreate;