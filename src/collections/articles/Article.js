// apollo
import { useQuery } from '@apollo/react-hooks';

// router
import { useParams } from 'react-router-dom';

// app
import { RETRIEVE_BY_ID } from './ArticleSchema';
import { Sections } from '../sections/Sections';

export const Article = () => {
    const params = useParams();

    const { loading, error, data } = useQuery(RETRIEVE_BY_ID, {
        variables: {
            id: parseInt(params.id)
        }
    });
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <div className="article">

            <div className="container">

                <h1>{data.articleById.name}</h1>

            </div>

            <div className="container">

                <Sections article={data.articleById} />

            </div>

        </div>
    );
};

export default Article;