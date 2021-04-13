import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const Button = ({
  color,
  onPress,
  title,
  disabled = false,
  full = false,
}: any) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        color ? { backgroundColor: color } : styles.primary,
        styles.container,
        full ? { width: dpx(375) } : { width: dpx(200) },
        disabled && { backgroundColor: Colors.lightGray },
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  primary: {
    backgroundColor: Colors.primary,
  },
  container: {
    paddingVertical: dpx(10),
    borderRadius: dpx(10),
    alignItems: "center",
  },
  text: {
    color: Colors.white,
    fontFamily: "Montserrat_700Bold",
    fontSize: dpx(14),
  },
});
