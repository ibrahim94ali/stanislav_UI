import { observer } from "mobx-react";
import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import ApartmentList from "../components/ApartmentList";
import SearchForm from "../components/SearchForm";
import Colors from "../constants/Colors";
import { useStore } from "../hooks/StoreContext";

function HomeScreen() {
  const store = useStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        color={Colors.secondary}
        title={isFiltersOpen ? "Close Filters" : "Open Filters"}
        onPress={() => setIsFiltersOpen(!isFiltersOpen)}
      />
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
});
