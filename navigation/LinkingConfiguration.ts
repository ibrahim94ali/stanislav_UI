import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
              ApartmentDetailsScreen: "apartmentDetails",
            },
          },
          Search: {
            screens: {
              SearchScreen: "search",
            },
          },
          Map: {
            screens: {
              MapScreen: "map",
            },
          },
          Profile: {
            screens: {
              ProfileScreen: "profile",
              RegisterScreen: "register",
              LoginScreen: "login",
              NewApartmentFormScreen: "newApartment",
              MyApartmentsScreen: "myApartments",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
