import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            initialRouteName: "HomeScreen",
            screens: {
              HomeScreen: "home",
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
