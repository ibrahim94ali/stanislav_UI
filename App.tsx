import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
} from "@apollo/client";

import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    alert("Error" + graphQLErrors[0].message);
  }
  if (networkError) {
    alert("Error" + networkError.message);
  }
});
const link = from([
  errorLink,
  new HttpLink({
    uri: "http://192.168.0.22:3000/graphql",
  }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import ApartmentsData from "./ApartmentsContext";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <ApartmentsData>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </ApartmentsData>
      </ApolloProvider>
    );
  }
}
