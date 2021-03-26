import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../hooks/StoreContext";
import { observer } from "mobx-react";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { dpx } from "../constants/Spacings";
import { useApolloClient } from "@apollo/client";

function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const store = useStore();
  const client = useApolloClient();

  const handleRegister = () => {
    navigation.navigate("RegisterScreen");
  };

  const handleLogin = () => {
    navigation.navigate("LoginScreen");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      store.setUser(null);
      client.resetStore();
    } catch (e) {
      console.log(e);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("lang", lang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.langContainer}>
        <RNPickerSelect
          placeholder={{}}
          value={i18n.language}
          onValueChange={handleLanguageChange}
          itemKey="value"
          items={[
            { label: "English", value: "en" },
            { label: "Türkçe", value: "tr" },
            { label: "Shqip", value: "al" },
            { label: "Македонски", value: "mk" },
          ]}
          style={pickerSelectStyles}
        />
      </View>
      {store.user ? (
        <View>
          <Text style={styles.title}>
            {t("PROFILE.HELLO")}, {store.user.name} {store.user.surname}
          </Text>
          <Button
            title={t("PROFILE.LOGOUT")}
            onPress={handleLogout}
            color={Colors.secondary}
          />
          <Text style={[styles.title, { marginTop: 50 }]}>
            {t("PROFILE.MANAGE_YOUR_APT")}
          </Text>
          <Button
            title={t("PROFILE.YOUR_APT")}
            color={Colors.primary}
            onPress={() => navigation.push("MyApartmentsScreen")}
          />
          <Text style={[styles.title, { marginTop: 50 }]}>
            {t("PROFILE.SEE_FAV_APT")}
          </Text>
          <Button
            title={t("PROFILE.FAV_APT")}
            color={Colors.primary}
            onPress={() => navigation.push("MyFavoriteApartmentsScreen")}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>{t("PROFILE.YOU_NOT_LOGGIN_IN")}</Text>
          <Button
            color={Colors.primary}
            title={t("PROFILE.LOGIN")}
            onPress={handleLogin}
          />
          <Text style={[styles.title, styles.register]}>
            {t("PROFILE.REGISTER_HERE")}
          </Text>
          <Button
            color={Colors.secondary}
            title={t("PROFILE.REGISTER")}
            onPress={handleRegister}
          />
        </View>
      )}
    </View>
  );
}

export default observer(ProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  register: {
    marginTop: 30,
  },
  langContainer: {
    marginBottom: dpx(30),
    width: dpx(200),
  },
});
