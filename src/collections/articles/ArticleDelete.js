import { useMutation } from '@apollo/react-hooks';

import { RETRIEVE_ALL, DELETE_BY_ID } from './ArticleSchema';

export const DeleteArticle = ({ id }) => {
    const [deleteArticle] = useMutation(DELETE_BY_ID, {
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
                            ...allArticles.nodes.filter(article => article.id !== id)
                        ]
                    }
                }
            })
        }
    })

    return (
        <div>
            <button
                onClick={e => {
                    e.preventDefault();

                    deleteArticle({
                        variables: {
                            input: {
                                id: id
                            }
                        }
                    })
                }}
            >Delete</button>
        </div>
    );
};

export default DeleteArticle;