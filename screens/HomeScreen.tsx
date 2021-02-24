import * as React from "react";
import { useContext } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ApartmentsContext } from "../ApartmentsContext";
import Apartment from "../components/Apartment";

import { View, Text } from "../components/Themed";
import { ApartmentI } from "../interfaces";

export default function HomeScreen() {
  const apartments = useContext(ApartmentsContext);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{apartments.length} Apartments found</Text>
      <FlatList
        data={apartments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const renderItem = ({ item }: { item: ApartmentI }) => {
  return <Apartment apartment={item} />;
};

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
