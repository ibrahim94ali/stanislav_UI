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
              ApartmentListScreen: "property-list",
              ApartmentDetailsScreen: "property-details",
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
              AddEditApartmentScreen: "add-edit-property",
              MyApartmentsScreen: "my-properties",
              MyFavoriteApartmentsScreen: "my-favorite-properties",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};

export default linking;
