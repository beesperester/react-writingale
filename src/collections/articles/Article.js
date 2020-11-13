// apollo
import { useQuery } from '@apollo/client';

// router
import { useParams } from 'react-router-dom';

// app
import { RETRIEVE } from './ArticleSchema';
import { Sections } from '../sections/SectionsColumns';

export const Article = () => {
    const params = useParams();

    const { loading, error, data } = useQuery(RETRIEVE, {
        variables: {
            nodeId: params.nodeId
        }
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="article">

            <div className="container">

                <h1>{data.article.name}</h1>

            </div>

            <div className="p-4">

                <Sections article={data.article} />

            </div>

        </div>
    );
};

export default Article;