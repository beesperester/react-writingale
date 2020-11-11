// react
import { useState } from 'react';

// apollo
import { useMutation } from '@apollo/react-hooks';

// router
import {
    Link
} from 'react-router-dom';
import history from '../../history';

// bootstrap
import { Check } from 'react-bootstrap-icons';

// app
import { UPDATE_BY_ID } from './ArticleSchema';

export const ArticleCardEdit = ({ article }) => {
    let input;

    const [updateByID] = useMutation(UPDATE_BY_ID, {
        onCompleted(data) {
            history.push('/articles');
        }
    });

    const [inputValue, setInput] = useState(article.name);

    return (
        <div className="card">

            <form
                onSubmit={e => {
                    e.preventDefault();

                    if (!input.value) return;

                    updateByID({
                        variables: {
                            input: {
                                id: article.id,
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

                    <button type="submit" className="btn btn-success mx-1">
                        
                        <Check />Update
                    
                    </button>

                    <Link to={`/articles/${article.id}`} className="btn btn-link mx-1">Cancel</Link>

                </div>

                <div className="card-toolbar-spacer"></div>

            </form>
        </div>
    );
};

export default ArticleCardEdit;