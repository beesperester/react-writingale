import { useState } from 'react';

import { useMutation } from '@apollo/react-hooks';

import { UPDATE_BY_ID } from './ArticleSchema';

export const UpdateArticle = ({ id, name }) => {
    let input;

    const [updateArticle] = useMutation(UPDATE_BY_ID);

    const [inputValue, setInput] = useState(name);

    return (
        <div>
            <form
                onSubmit={e => {
                    e.preventDefault();

                    if (!input.value) return;

                    updateArticle({
                        variables: {
                            input: {
                                id: id,
                                articlePatch: {
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
                    onChange={e => {
                        setInput(e.target.value)
                    }}
                    value={inputValue}
                />

                <button type="submit">Update</button>

            </form>
        </div>
    );
};

export default UpdateArticle;