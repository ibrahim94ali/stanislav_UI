import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const IconButton = ({ children, handlePress, disabled, style }: any) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.container, style]}
      disabled={disabled}
    >
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
