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
    uri: "https://stanislav-app.herokuapp.com/graphql",
  }),
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import StoreContextProvider, { useStore } from "./hooks/StoreContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GET_APARTMENTS } from "./graphQL/Queries";

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
            <Navigation colorScheme={colorScheme} />
            <AuthenticateUser />
            <GetInitialData />
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

  const store = useStore();
  useEffect(() => {
    getStoredUserData();
  });
  return null;
};

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
