import { useQuery } from '@apollo/react-hooks';
import {
    Link,
    useParams
} from 'react-router-dom';

// app
import { RETRIEVE_ALL } from './ArticleSchema';
import ArticleCreate from './ArticleCreate';
import ArticleCard from './ArticleCard';
import ArticleCardEdit from './ArticleCardEdit';

export const modes = {
    list: Symbol('list'),
    edit: Symbol('edit')
}

export const Articles = ({ mode }) => {
    const { loading, error, data } = useQuery(RETRIEVE_ALL);

    const params = useParams();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.log(mode, params);

    return (
        <div>

            

            <div className="container my-4">

                <h1>Articles</h1>

                <ArticleCreate />

            </div>

            <div className="container">
                
                <div className="card-deck">
            {data.allArticles.nodes.map(article => {
                if (mode === modes.edit && parseInt(params.id) === article.id) {
                    return (
                        <ArticleCardEdit key={article.id} article={article} />
                    );
                }

                return (
                    <ArticleCard key={article.id} article={article} editable={true} />
                );
            })}
            </div>

            </div>

        </div>
    );
};

export default Articles;