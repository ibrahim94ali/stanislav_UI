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
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import StoreContextProvider, { useStore } from "./hooks/StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_APARTMENTS } from "./graphQL/Queries";
import { Alert } from "react-native";
import { autorun } from "mobx";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const store = useStore();

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

  useEffect(() => {
    getStoredUserData();
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      Alert.alert("API Error", graphQLErrors[0].message);
    }
    if (networkError) {
      Alert.alert("Network Error", networkError.message);
    }
  });

  const link = from([
    errorLink,
    new HttpLink({
      uri: "https://stanislav-app.herokuapp.com/graphql",
    }),
  ]);

  const authLink = setContext((_, { headers }) => {
    const token = store.user?.token;
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache(),
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <StoreContextProvider>
          <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <GetInitialData />
            <StatusBar />
          </SafeAreaProvider>
        </StoreContextProvider>
      </ApolloProvider>
    );
  }
}

const GetInitialData = () => {
  const store = useStore();

  const { data } = useQuery(GET_APARTMENTS);
  useEffect(() => {
    if (data) {
      store.setApartments(data.apartments);
    }
  }, [data]);
  return null;
};
