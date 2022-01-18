import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";

import { createUploadLink } from "apollo-upload-client";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import StoreContextProvider, { useStore } from "./hooks/StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { inMemoryCacheConfig } from "./graphQL/InMemoryCacheConfig";
import "./i18n";
import { useTranslation } from "react-i18next";
import {
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import { SearchFiltersI } from "./interfaces";
import "react-native-gesture-handler";
import { useFonts } from "expo-font";

export default function App() {
  const isLoadingComplete = useCachedResources();

  const { i18n } = useTranslation();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

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

  const getStoredLanguage = async () => {
    try {
      const lang = await AsyncStorage.getItem("lang");
      if (lang) {
        i18n.changeLanguage(lang);
      } else {
        await AsyncStorage.setItem("lang", i18n.language);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getStoredFilters = async () => {
    try {
      const filters = await AsyncStorage.getItem("filters");
      if (filters) {
        const filtersObj: SearchFiltersI = JSON.parse(filters);
        store.setFilters(filtersObj);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getStoredUserData();
    getStoredLanguage();
    getStoredFilters();
  }, []);

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      Alert.alert("API Error", graphQLErrors[0].message);
    }
    if (networkError) {
      Alert.alert("Network Error", networkError.message);
    }
  });

  const localAPIUri = "http://192.168.0.111:3000/graphql";
  const herokuUri = "https://stanislav-app.herokuapp.com/graphql";
  const awsUri =
    "http://stanislav-env-2.eba-ada5zbfj.eu-central-1.elasticbeanstalk.com/graphql";

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
          <SafeAreaProvider>
            <Navigation />
            <StatusBar style="inverted" />
          </SafeAreaProvider>
        </StoreContextProvider>
      </ApolloProvider>
    );
  }
}
