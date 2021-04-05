import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const IconButton = ({ children, handlePress }: any) => {
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    width: dpx(40),
    height: dpx(40),
    borderRadius: 10,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
