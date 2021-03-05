import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ApartmentI } from "../interfaces";
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
    color: Colors.white,
  },
  field: {
    fontSize: 16,
    color: Colors.white,
  },
});
