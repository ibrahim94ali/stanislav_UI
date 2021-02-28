import { useQuery } from "@apollo/client";
import { observer, useObserver } from "mobx-react";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Apartment from "../components/Apartment";

import { View, Text } from "../components/Themed";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { ApartmentI } from "../interfaces";
import { StoreData } from "../StoreContext";

function HomeScreen() {
  const store = StoreData();

  const { data } = useQuery(GET_APARTMENTS);
  useEffect(() => {
    if (data) {
      store.setApartments(data.apartments);
    }
  }, [data]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {store.apartments.length} Apartments found
      </Text>
      <FlatList
        data={store.apartments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={store.apartments}
      />
    </View>
  );
}

const renderItem = ({ item }: { item: ApartmentI }) => {
  return <Apartment apartment={item} />;
};

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
