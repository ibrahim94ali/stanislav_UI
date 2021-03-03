import React from "react";
import { StyleSheet } from "react-native";
import { ApartmentI } from "../interfaces";
import { View, Text } from "../components/Themed";
import Colors from "../constants/Colors";

export default function Apartment({ apartment }: { apartment: ApartmentI }) {
  return (
    <View style={styles.container}>
      <Text style={styles.field}>{apartment.title}</Text>
      <Text style={styles.field}>{apartment.city}</Text>
      <Text style={styles.field}>{apartment.price} euro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: Colors.primary,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
  },
  field: {
    fontSize: 16,
  },
});
