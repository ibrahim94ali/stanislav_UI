import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
  from,
  useQuery,
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
    uri: "http://192.168.0.33:3000/graphql",
  }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import StoreContextProvider, { StoreData } from "./StoreContext";
import { View } from "./components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <StoreContextProvider>
          <SafeAreaProvider>
            <AuthenticateUser />
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
          </SafeAreaProvider>
        </StoreContextProvider>
      </ApolloProvider>
    );
  }
}

const AuthenticateUser = () => {
  const getStoredUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue) {
        store.setUser(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const store = StoreData();
  useEffect(() => {
    getStoredUserData();
  });
  return <View />;
};
