import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import Property from "../components/Property";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { GET_FAV_APARTMENTS } from "../graphQL/Queries";
import { ApartmentI } from "../interfaces";

const MyFavoriteApartmentsScreen = ({ navigation }: any) => {
  const { data: myFavApartments, loading: loadingApartments } = useQuery(
    GET_FAV_APARTMENTS
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loadingApartments ? <LoadingSpinner /> : null}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>Favorite Apartments</Text>
        <View style={{ width: dpx(40) }}></View>
      </Header>

      <ScrollView
        style={styles.propertyContainer}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {myFavApartments &&
          myFavApartments.favorites.map((apart: ApartmentI) => (
            <View key={apart.id} style={styles.property}>
              <Property apartment={apart} isFavorite />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyFavoriteApartmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
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
