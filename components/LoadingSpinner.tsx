import React from "react";
import { StyleSheet, View, ActivityIndicator, Modal } from "react-native";
import Colors from "../constants/Colors";

const LoadingSpinner = () => {
  return (
    <Modal animationType="fade" transparent={true} visible={true}>
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    </Modal>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
