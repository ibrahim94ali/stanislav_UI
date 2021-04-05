import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ApartmentList from "../components/ApartmentList";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBox from "../components/SearchBox";
import SearchForm from "../components/SearchForm";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";
import City from "../components/City";
import { TouchableOpacity } from "react-native-gesture-handler";
import Property from "../components/Property";
import Sponsor from "../components/Sponsor";
import { ApartmentI } from "../interfaces";

function HomeScreen() {
  const store = useStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: store.filters,
  });

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <View style={styles.headerContainer}>
        <View style={styles.searchField}>
          <SearchBox />
        </View>
        <IconButton handlePress={() => console.log("click")}>
          <Ionicons name="options" color={Colors.black} size={dpx(24)} />
        </IconButton>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.header}>Cities</Text>
          <ScrollView
            style={styles.cityContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <City />
            <City />
            <City />
            <City />
          </ScrollView>
        </View>
        <View style={styles.propertiesContainer}>
          <View style={styles.propertiesHeaders}>
            <Text style={styles.header}>Featured Properties</Text>
            <TouchableOpacity>
              <Text style={styles.propertiesHeaderBtn}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.propertyContainer}
            contentContainerStyle={{ paddingBottom: 10 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {data
              ? data.apartments.map((apart: ApartmentI) => (
                  <View style={{ width: dpx(270), height: dpx(270) }}>
                    <Property key={apart.id} apartment={apart} />
                  </View>
                ))
              : null}
          </ScrollView>
        </View>
        <View style={styles.sponsorContainer}>
          <Text style={styles.header}>Sponsors</Text>
          <ScrollView
            style={styles.propertyContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <Sponsor />
            <Sponsor />
            <Sponsor />
            <Sponsor />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: dpx(20),
  },

  searchField: {
    flex: 1,
    marginRight: dpx(20),
  },

  cityContainer: {
    marginTop: dpx(10),
  },

  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
    marginLeft: dpx(20),
  },
  propertiesContainer: {
    marginTop: dpx(20),
  },
  propertiesHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: dpx(20),
  },
  propertiesHeaderBtn: {
    fontFamily: "Montserrat_700Bold",
    color: Colors.secondary,
    fontSize: dpx(14),
  },
  propertyContainer: {
    marginTop: dpx(10),
    overflow: "visible",
  },
  sponsorContainer: {
    marginTop: dpx(10),
  },
});
