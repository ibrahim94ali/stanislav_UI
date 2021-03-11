import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
  useQuery,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { createUploadLink } from "apollo-upload-client";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import StoreContextProvider, { useStore } from "./hooks/StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_APARTMENTS } from "./graphQL/Queries";
import { Alert } from "react-native";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { inMemoryCacheConfig } from "./graphQL/InMemoryCacheConfig";

export default function App() {
  const isLoadingComplete = useCachedResources();

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

  const localAPIUri = "http://192.168.0.36:3000/graphql";
  const herokuUri = "https://stanislav-app.herokuapp.com/graphql";

  const link = from([
    errorLink,
    createUploadLink({
      uri: herokuUri,
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
    cache: new InMemoryCache(inMemoryCacheConfig),
  });

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <StoreContextProvider>
          <ActionSheetProvider>
            <SafeAreaProvider>
              <Navigation />
              <GetInitialData />
              {/* <StatusBar /> */}
            </SafeAreaProvider>
          </ActionSheetProvider>
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
