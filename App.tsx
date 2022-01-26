import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
  useReactiveVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { createUploadLink } from "apollo-upload-client";

import useCachedResources from "./hooks/useCachedResources";
import Navigation from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
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
import { setFilters, setUser, userVar } from "./Store";

export default function App() {
  const isLoadingComplete = useCachedResources();

  const { i18n } = useTranslation();

  const user = useReactiveVar(userVar);

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const getStoredUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue) {
        setUser(JSON.parse(jsonValue));
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
        setFilters(filtersObj);
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
    const token = user?.token;
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

  if (!isLoadingComplete || !fontsLoaded) {
    return null;
  } else {
    return (
      <ApolloProvider client={client}>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar style="dark" />
        </SafeAreaProvider>
      </ApolloProvider>
    );
  }
}
