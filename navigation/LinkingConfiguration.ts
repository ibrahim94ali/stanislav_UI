import * as Linking from "expo-linking";
import { LinkingOptions } from "@react-navigation/native";
import { RootStackParamList } from "../types";

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            initialRouteName: "HomeScreen",
            screens: {
              HomeScreen: "home",
              FiltersScreen: "filters",
              ApartmentListScreen: "propertyList",
              ApartmentDetailsScreen: "propertyDetails",
            },
          },
          Map: {
            initialRouteName: "MapScreen",
            screens: {
              MapScreen: "map",
            },
          },
          Profile: {
            initialRouteName: "ProfileScreen",
            screens: {
              ProfileScreen: "profile",
              RegisterScreen: "register",
              LoginScreen: "login",
              AddEditApartmentScreen: "addEditProperty",
              MyApartmentsScreen: "myProperties",
              MyFavoriteApartmentsScreen: "myFavoriteProperties",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
