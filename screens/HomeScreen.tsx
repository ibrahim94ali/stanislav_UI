import { observer } from "mobx-react";
import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import Apartment from "../components/Apartment";
import { ApartmentI } from "../interfaces";
import { useStore } from "../hooks/StoreContext";
import { StackNavigationHelpers } from "@react-navigation/stack/lib/typescript/src/types";
import SearchForm from "../components/SearchForm";
import Colors from "../constants/Colors";

function HomeScreen({ navigation }: { navigation: StackNavigationHelpers }) {
  const store = useStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const renderItem = ({ item }: { item: ApartmentI }) => (
    <TouchableWithoutFeedback
      onPress={() =>
        navigation.navigate("ApartmentDetailsScreen", { apartment: item })
      }
    >
      <Apartment apartment={item} />
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Button
        color={Colors.secondary}
        title={isFiltersOpen ? "Close Filters" : "Open Filters"}
        onPress={() => setIsFiltersOpen(!isFiltersOpen)}
      />
      {isFiltersOpen ? <SearchForm /> : null}
      <Text style={styles.title}>
        {store.apartments.length} Apartments found
      </Text>
      <FlatList
        data={store.apartments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

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
