import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { ApartmentI } from "../interfaces";
import Colors from "../constants/Colors";

export default function Apartment({ apartment }: { apartment: ApartmentI }) {
  return (
    <View style={styles.container}>
      <Text style={[styles.field, styles.title]}>{apartment.title}</Text>
      <Text style={styles.field}>City: {apartment.city}</Text>
      <Text style={styles.field}>Price: {apartment.price} €</Text>
      <Text style={styles.field}>Area: {apartment.msquare} ms2</Text>
      <Text style={styles.field}>Rooms:{apartment.roomCount}</Text>
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
    fontWeight: "bold",
    alignSelf: "center",
  },
  field: {
    fontSize: 16,
    color: Colors.white,
  },
});
