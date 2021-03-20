import { observer } from "mobx-react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ApartmentList from "../components/ApartmentList";
import SearchForm from "../components/SearchForm";
import Colors from "../constants/Colors";
import { useStore } from "../hooks/StoreContext";

function HomeScreen() {
  const store = useStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsFiltersOpen(!isFiltersOpen)}
      >
        <Text style={styles.buttonText}>
          {isFiltersOpen ? "Close Filters" : "Open Filters"}
        </Text>
      </TouchableOpacity>
      <SearchForm open={isFiltersOpen} />

      <ApartmentList data={store.apartments} />
    </View>
  );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  button: {
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  buttonText: {
    color: Colors.white,
    textTransform: "uppercase",
  },
});
