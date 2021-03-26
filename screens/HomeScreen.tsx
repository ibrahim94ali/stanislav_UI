import { useQuery } from "@apollo/client";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ApartmentList from "../components/ApartmentList";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchForm from "../components/SearchForm";
import Colors from "../constants/Colors";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";

function HomeScreen() {
  const store = useStore();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: store.filters,
  });

  return (
    <View style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsFiltersOpen(!isFiltersOpen)}
      >
        <Text style={styles.buttonText}>
          {isFiltersOpen ? "Close Filters" : "Open Filters"}
        </Text>
      </TouchableOpacity>
      <SearchForm open={isFiltersOpen} />

      <ApartmentList data={data?.apartments || []} />
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
