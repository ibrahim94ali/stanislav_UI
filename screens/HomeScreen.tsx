import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBox from "../components/SearchBox";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";
import City from "../components/City";
import { TouchableOpacity } from "react-native-gesture-handler";
import Property from "../components/Property";
import Sponsor from "../components/Sponsor";
import { ApartmentI } from "../interfaces";
import Header from "../components/Header";

function HomeScreen({ navigation }: any) {
  const store = useStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: store.filters,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <Header>
        <View style={styles.searchField}>
          <SearchBox />
        </View>
        <IconButton handlePress={() => console.log("click")}>
          <Ionicons name="options" color={Colors.black} size={dpx(24)} />
        </IconButton>
      </Header>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.header}>Cities</Text>
          <ScrollView
            style={styles.cityContainer}
            contentContainerStyle={{
              paddingRight: dpx(20),
            }}
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
            <TouchableOpacity
              onPress={() => navigation.push("ApartmentListScreen")}
            >
              <Text style={styles.propertiesHeaderBtn}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.propertyContainer}
            contentContainerStyle={{
              paddingBottom: dpx(10),
              paddingRight: dpx(20),
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {data &&
              data.apartments.map((apart: ApartmentI) => (
                <View key={apart.id} style={styles.property}>
                  <Property apartment={apart} />
                </View>
              ))}
          </ScrollView>
        </View>
        <View style={styles.sponsorContainer}>
          <Text style={styles.header}>Sponsors</Text>
          <ScrollView
            style={styles.propertyContainer}
            contentContainerStyle={{
              paddingRight: dpx(20),
            }}
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

  property: {
    width: dpx(270),
    height: dpx(270),
    marginLeft: dpx(20),
  },
  sponsorContainer: {
    marginTop: dpx(10),
  },
});
