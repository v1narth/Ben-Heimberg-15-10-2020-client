import { useMemo } from "react";
import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

let apolloClient: ApolloClient<NormalizedCacheObject>;

export function initializeApollo(initialState = null) {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT, 
    credentials: "same-origin",
    headers: {
      Authorization: process.browser ? localStorage.getItem('accessToken') : undefined 
    }
  });

  // @ts-ignore
  const wsLink = process.browser
    ? new WebSocketLink({
        uri: process.env.NEXT_PUBLIC_GRAPHQL_SUBSCRIPTION,
        options: {
          reconnect: true,
        },
      })
    : null;

  // @ts-ignore
  const link = process.browser
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === "OperationDefinition" &&
            definition.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

  function createApolloClient() {
    return new ApolloClient({
      ssrMode: typeof window === "undefined",
      link,
      cache: new InMemoryCache(),
    });
  }
  const _apolloClient = createApolloClient();


  if (initialState) {
    const existingCache = _apolloClient.extract();

    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }
  if (typeof window === "undefined") return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}

