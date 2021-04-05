import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import {
  BottomTabParamList,
  HomeParamList,
  ProfileParamList,
  MapParamList,
} from "../types";
import MapScreen from "../screens/MapScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import ApartmentDetailsScreen from "../screens/ApartmentDetailsScreen";
import AddEditApartmentScreen from "../screens/AddEditApartmentScreen";
import MyApartmentsScreen from "../screens/MyApartmentsScreen";
import MyFavoriteApartmentsScreen from "../screens/MyFavoriteApartmentsScreen";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator initialRouteName="Home">
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Map"
        component={MapNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="person" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const HomeStack = createStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerTitle: "Home" }}
      />
      <HomeStack.Screen
        name="ApartmentDetailsScreen"
        component={ApartmentDetailsScreen}
      />
    </HomeStack.Navigator>
  );
}

const MapStack = createStackNavigator<MapParamList>();

function MapNavigator() {
  return (
    <MapStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <MapStack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerTitle: "Map" }}
      />
      <MapStack.Screen
        name="ApartmentDetailsScreen"
        component={ApartmentDetailsScreen}
      />
    </MapStack.Navigator>
  );
}

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: "Profile" }}
      />
      <ProfileStack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerTitle: "Register" }}
      />
      <ProfileStack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerTitle: "Login" }}
      />
      <ProfileStack.Screen
        name="AddEditApartmentScreen"
        component={AddEditApartmentScreen}
        options={{ headerTitle: "Create New Apartment" }}
      />
      <ProfileStack.Screen
        name="MyApartmentsScreen"
        component={MyApartmentsScreen}
        options={{ headerTitle: "My Apartments" }}
      />
      <ProfileStack.Screen
        name="MyFavoriteApartmentsScreen"
        component={MyFavoriteApartmentsScreen}
        options={{ headerTitle: "My Favorite Apartments" }}
      />
      <ProfileStack.Screen
        name="ApartmentDetailsScreen"
        component={ApartmentDetailsScreen}
      />
    </ProfileStack.Navigator>
  );
}
