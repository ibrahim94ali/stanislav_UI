import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const City = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gostivar</Text>
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Explore</Text>
        <Ionicons name="arrow-forward-sharp" size={dpx(16)} />
      </TouchableOpacity>
    </View>
  );
};

export default City;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: dpx(15),
    paddingHorizontal: dpx(55),
    marginLeft: dpx(20),

    backgroundColor:
      "linear-gradient(0deg, rgba(51, 51, 51, 0.5), rgba(51, 51, 51, 0.5))",

    borderRadius: dpx(10),
  },
  title: {
    fontSize: dpx(16),
    fontFamily: "Montserrat_700Bold",
    color: Colors.white,
    marginBottom: dpx(20),
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: dpx(8),
    paddingHorizontal: dpx(20),
    backgroundColor: Colors.white,
    borderRadius: dpx(10),
  },
  btnText: {
    fontFamily: "Montserrat_400Regular",
    color: Colors.black,
    fontSize: dpx(14),
    marginRight: dpx(5),
  },
});
