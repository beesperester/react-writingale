// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/react-hooks';

// bootstrap
import { PencilFill, TrashFill, ArrowUpRight, Check, X } from 'react-bootstrap-icons';

// router
import {
    Link
} from 'react-router-dom';

// app
import { RETRIEVE_ALL, UPDATE, DELETE } from './ArticleSchema';

const modes = {
    show: Symbol('show'),
    edit: Symbol('edit')
}

export const ArticleCard = ({ article, editable }) => {
    let input;

    // state
    const [inputValue, setInput] = useState(article.name);

    const [mode, switchMode] = useState(modes.show);

    // mutations
    const [updateArticle] = useMutation(UPDATE, {
        onCompleted(data) {
            switchMode(modes.show);
        }
    });

    const [deleteArticle] = useMutation(DELETE, {
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
                            ...allArticles.nodes.filter(x => x.nodeId !== article.nodeId)
                        ]
                    }
                }
            })
        }
    });

    if (mode === modes.edit) {
        return (
            <div className="card article">

                <form
                    onSubmit={e => {
                        e.preventDefault();

                        if (!input.value) return;

                        updateArticle({
                            variables: {
                                input: {
                                    nodeId: article.nodeId,
                                    articlePatch: {
                                        name: input.value
                                    }
                                }
                            }
                        });
                    }}
                >

                    <div className="card-body form-inline">

                        <div className="form-group">

                            <label htmlFor="article-name">Name</label>

                            <input
                                name="article-name"
                                className="form-control mx-2"
                                ref={node => {
                                    input = node;
                                }}
                                onChange={e => {
                                    setInput(e.target.value)
                                }}
                                value={inputValue}
                            />

                        </div>

                    </div>

                    <div className="card-toolbar">

                        <button type="submit" className="btn btn-success btn-sm mx-1">
                            
                            <Check />Update
                        
                        </button>

                        <button 
                            className="btn btn-link btn-sm mx-1"
                            onClick={e => {
                                e.preventDefault();

                                switchMode(modes.show);
                            }}
                        >
                            <X />Cancel
                            
                        </button>

                    </div>

                    <div className="card-toolbar-spacer"></div>

                </form>
                
            </div>
        );
    }

    return (
        <div className="card article">

            <div className="card-body">

                <h3 className="card-title">{article.name}</h3>

            </div>

            <div className="card-toolbar">

                <Link to={`/articles/${article.nodeId}`} className="btn btn-primary mx-1">
                    
                    <ArrowUpRight />Open
                    
                </Link>

                {editable ? (
                    <button 
                        className="btn btn-success btn-sm mx-1"
                        onClick={e => {
                            e.preventDefault();

                            switchMode(modes.edit);
                        }}
                    >
                        
                        <PencilFill />Edit    
                        
                    </button>
                ) : undefined}

                {editable ? (
                    <button 
                        className="btn btn-danger btn-sm mx-1"
                        onClick={e => {
                            e.preventDefault();
        
                            deleteArticle({
                                variables: {
                                    input: {
                                        nodeId: article.nodeId
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