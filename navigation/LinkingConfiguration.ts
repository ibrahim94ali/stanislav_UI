import * as Linking from "expo-linking";

export default {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: "home",
              ApartmentListScreen: "apartmentList",
              ApartmentDetailsScreen: "apartmentDetails",
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
              AddEditApartmentScreen: "addEditApartment",
              MyApartmentsScreen: "myApartments",
              MyFavoriteApartmentsScreen: "myFavoriteApartments",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};
