import { useQuery } from '@apollo/react-hooks';

import { RETRIEVE_ALL } from './ArticleSchema';

import CreateArticle from './ArticleCreate';
import UpdateArticle from './ArticleUpdate';
import DeleteArticle from './ArticleDelete';

export const ArticleList = () => {
    const { loading, error, data } = useQuery(RETRIEVE_ALL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>

            <h1>Articles</h1>

            <CreateArticle />

            {data.allArticles.nodes.map(({ id, name }) => (
                <div 
                    key={id}
                    className="article"
                >
                    <strong>{name}</strong>

                    <UpdateArticle id={id} name={name} />

                    <DeleteArticle id={id} />
                </div>
            ))}

        </div>
    );
};

export default ArticleList;