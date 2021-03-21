import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React, { useEffect, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ApartmentList from "../components/ApartmentList";
import LoadingSpinner from "../components/LoadingSpinner";
import { GET_MY_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";

const MyApartmentsScreen = ({ navigation }: any) => {
  const store = useStore();
  const { data: myApartments, loading: loadingApartments } = useQuery(
    GET_MY_APARTMENTS,
    {
      fetchPolicy: "no-cache",
    }
  );

  useEffect(() => {
    if (myApartments?.myApartments) {
      store.setMyApartments(myApartments.myApartments);
    }
  }, [myApartments]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.push("NewApartmentFormScreen")}
        >
          <Ionicons size={30} style={{ marginRight: 15 }} name="add" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      {loadingApartments ? <LoadingSpinner /> : null}
      <ApartmentList data={store.myApartments} editable={true} />
    </View>
  );
};

export default observer(MyApartmentsScreen);

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
