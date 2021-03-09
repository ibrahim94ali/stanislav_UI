import { useNavigation } from "@react-navigation/core";
import { observer } from "mobx-react";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";
import { ApartmentI } from "../interfaces";
import Apartment from "./Apartment";

const ApartmentList = ({ data }: any) => {
  const navigation = useNavigation();
  const renderItem = ({ item }: { item: ApartmentI }) => (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("ApartmentDetailsScreen", { apartment: item });
      }}
    >
      <View>
        <Apartment apartment={item} />
      </View>
    </TouchableWithoutFeedback>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.length} Apartments</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default observer(ApartmentList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 20,
  },
});
