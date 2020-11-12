// apollo
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export const cache = new InMemoryCache({
    dataIdFromObject(responseObject) {
        return responseObject.nodeId;
    }
});

export const link = new createHttpLink({
    uri: 'http://localhost:5000/graphql'
});

export const client = new ApolloClient({
    cache,
    link
});

export default client;