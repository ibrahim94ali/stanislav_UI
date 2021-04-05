import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const Sponsor = () => {
  return <View style={styles.container}></View>;
};

export default Sponsor;

const styles = StyleSheet.create({
  container: {
    width: dpx(80),
    height: dpx(80),
    backgroundColor: Colors.gray,
    borderRadius: dpx(10),
    marginLeft: dpx(20),
  },
});
