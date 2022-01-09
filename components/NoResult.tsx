import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

const NoResult = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="search-off"
        size={dpx(80)}
        color={Colors.lightGray}
      />
      <Text style={styles.text}>{t("NO_RESULT.NO_RESULT_FOUND")}</Text>
    </View>
  );
};

export default NoResult;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: dpx(20),
    marginTop: dpx(100),
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.black,
  },
});
