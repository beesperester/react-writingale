import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

// styles
import './styles/custom.scss';

// apollo
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

// app
import App from './App';

const cache = new InMemoryCache({
    dataIdFromObject(responseObject) {
        return responseObject.nodeId;
    }
});
const link = new HttpLink({
    uri: 'http://localhost:5000/graphql'
})

const client = new ApolloClient({
    cache,
    link
})

ReactDOM.render(
    <ApolloProvider client={client}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
