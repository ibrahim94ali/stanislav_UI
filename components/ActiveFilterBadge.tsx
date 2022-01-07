import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const ActiveFilterBadge = ({ name, onPress }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity onPress={() => onPress()} style={styles.removeBtn}>
        <Ionicons name="md-remove-circle" color={Colors.white} size={dpx(16)} />
      </TouchableOpacity>
    </View>
  );
};

export default ActiveFilterBadge;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: dpx(5),
    backgroundColor: Colors.secondary,
    borderRadius: dpx(5),
  },
  name: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(12),
    color: Colors.white,
  },
  removeBtn: {
    padding: 5,
  },
});
