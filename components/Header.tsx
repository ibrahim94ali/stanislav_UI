import React from "react";
import { StyleSheet, View } from "react-native";
import { dpx } from "../constants/Spacings";

const Header = ({ children }: any) => {
  return <View style={styles.headerContainer}>{children}</View>;
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: dpx(20),
  },
});
