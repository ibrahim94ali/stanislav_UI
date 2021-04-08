import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { useFonts, Montserrat_500Medium } from "@expo-google-fonts/montserrat";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import AppLoading from "expo-app-loading";

const ActiveFilterBadge = ({ name }: any) => {
  const [fontsLoaded] = useFonts({
    Montserrat_500Medium,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      <TouchableOpacity
        onPress={() => console.log("click")}
        style={styles.removeBtn}
      >
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
    marginRight: dpx(10),
  },
  name: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(10),
    color: Colors.white,
  },
  removeBtn: {
    padding: 5,
  },
});
