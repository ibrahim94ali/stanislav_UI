import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import ActiveFilterBadge from "../components/ActiveFilterBadge";
import { useQuery } from "@apollo/client";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { observer } from "mobx-react";
import { useStore } from "../hooks/StoreContext";
import { ApartmentI } from "../interfaces";
import Property from "../components/Property";
import AppLoading from "expo-app-loading";
import LoadingSpinner from "../components/LoadingSpinner";

const ApartmentListScreen = ({ navigation }: any) => {
  const store = useStore();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: store.filters,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>Properties</Text>
        <IconButton handlePress={() => console.log("click")}>
          <MaterialCommunityIcons
            name="sort-ascending"
            color={Colors.black}
            size={dpx(24)}
          />
        </IconButton>
      </Header>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ marginLeft: dpx(20) }}
        style={styles.activeFilters}
      >
        <ActiveFilterBadge name="Rent" />
        <ActiveFilterBadge name="Apartment" />
        <ActiveFilterBadge name="Furnished" />
        <ActiveFilterBadge name="Furnished" />
      </ScrollView>

      <ScrollView
        style={styles.propertyContainer}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {data
          ? data.apartments.map((apart: ApartmentI) => (
              <View key={apart.id} style={styles.property}>
                <Property apartment={apart} />
              </View>
            ))
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(ApartmentListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
    marginLeft: dpx(20),
  },
  activeFilters: {
    flexGrow: 0,
  },
  propertyContainer: {
    marginTop: dpx(10),
  },
  property: {
    width: dpx(330),
    height: dpx(270),
    marginBottom: dpx(20),
  },
});
