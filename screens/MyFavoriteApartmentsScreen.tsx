import { useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ApartmentList from "../components/ApartmentList";
import LoadingSpinner from "../components/LoadingSpinner";
import { GET_FAV_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";

const MyFavoriteApartmentsScreen = () => {
  const store = useStore();
  const { data: myFavApartments, loading: loadingApartments } = useQuery(
    GET_FAV_APARTMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (myFavApartments) {
      store.setFavoriteApartments(myFavApartments.favorites);
    }
  }, [myFavApartments]);

  return (
    <View style={styles.container}>
      {loadingApartments ? <LoadingSpinner /> : null}
      <ApartmentList data={store.favApartments} />
    </View>
  );
};

export default observer(MyFavoriteApartmentsScreen);

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
