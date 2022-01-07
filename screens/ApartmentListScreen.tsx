import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import ActiveFilterBadge from "../components/ActiveFilterBadge";
import { useQuery } from "@apollo/client";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { observer } from "mobx-react";
import { useStore } from "../hooks/StoreContext";
import { ApartmentI } from "../interfaces";
import Property from "../components/Property";
import LoadingSpinner from "../components/LoadingSpinner";

const ApartmentListScreen = ({ navigation }: any) => {
  const store = useStore();

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: store.filters,
  });

  const removeFilters = () => {
    store.resetFilters();
  };

  return (
    <SafeAreaView style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>Properties</Text>
        <IconButton handlePress={() => console.log("click")}>
          <MaterialCommunityIcons
            name="sort-ascending"
            color={Colors.black}
            size={dpx(24)}
          />
        </IconButton>
      </Header>

      {store.isAnyFilterActive && (
        <View style={styles.activeFiltersContainer}>
          <ActiveFilterBadge
            name="Active Filters"
            onPress={() => removeFilters()}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        {data &&
          data.apartments.map((apart: ApartmentI) => (
            <View key={apart.id} style={styles.property}>
              <Property apartment={apart} />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default observer(ApartmentListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  activeFiltersContainer: {
    marginBottom: dpx(10),
    justifyContent: "center",
    alignItems: "center",
  },
  property: {
    width: dpx(330),
    height: dpx(270),
    marginBottom: dpx(20),
  },
});
