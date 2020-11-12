// apollo
import { useQuery } from '@apollo/react-hooks';

// app
import { RETRIEVE_ALL } from './ArticleSchema';
import ArticleCreate from './ArticleCreate';
import ArticleCard from './ArticleCard';

export const Articles = ({ mode }) => {
    const { loading, error, data } = useQuery(RETRIEVE_ALL);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div>

            <div className="container my-4">

                <h1>Articles</h1>

                <ArticleCreate />

            </div>

            <div className="container">
                
                <div className="card-deck">
            {data.allArticles.nodes.map(article => 
                <ArticleCard key={article.nodeId} article={article} editable={true} />
            )}
            </div>

            </div>

        </div>
    );
};

export default Articles;