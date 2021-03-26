import { useQuery } from "@apollo/client";
import React from "react";
import { StyleSheet, View } from "react-native";
import ApartmentList from "../components/ApartmentList";
import LoadingSpinner from "../components/LoadingSpinner";
import { GET_FAV_APARTMENTS } from "../graphQL/Queries";

const MyFavoriteApartmentsScreen = () => {
  const { data: myFavApartments, loading: loadingApartments } = useQuery(
    GET_FAV_APARTMENTS
  );

  return (
    <View style={styles.container}>
      {loadingApartments ? <LoadingSpinner /> : null}
      <ApartmentList data={myFavApartments?.favorites || []} />
    </View>
  );
};

export default MyFavoriteApartmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
});
