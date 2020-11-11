// react
import { useMutation } from '@apollo/react-hooks';

// bootstrap
import { PencilFill, TrashFill, ArrowUpRight } from 'react-bootstrap-icons';

// router
import {
    Link
} from 'react-router-dom';

// app
import { RETRIEVE_ALL, DELETE_BY_ID } from './ArticleSchema';

export const ArticleCard = ({ article, editable }) => {
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
                            ...allArticles.nodes.filter(x => x.id !== article.id)
                        ]
                    }
                }
            })
        }
    });

    return (
        <div className="card">

            <div className="card-body">

                <h3 className="card-title">{article.name}</h3>

            </div>

            <div className="card-toolbar">

                <Link to={`/articles/${article.id}`} className="btn btn-primary mx-1">
                    
                    <ArrowUpRight />Open
                    
                </Link>

                {editable ? (
                    <Link to={`/articles/${article.id}/edit`} className="btn btn-success btn-sm mx-1">
                        
                        <PencilFill />Edit
                        
                    </Link>
                ) : undefined}

                {editable ? (
                    <button 
                        className="btn btn-danger btn-sm mx-1"
                        onClick={e => {
                            e.preventDefault();
        
                            deleteArticle({
                                variables: {
                                    input: {
                                        id: article.id
                                    }
                                }
                            })
                        }}
                    >
                        
                        <TrashFill />Delete
                        
                    </button>
                ) : undefined}

            </div>

            <div className="card-toolbar-spacer"></div>

        </div>
    )
}

export default ArticleCard;