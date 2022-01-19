import * as React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../hooks/StoreContext";
import { observer } from "mobx-react";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { dpx } from "../constants/Spacings";
import { useApolloClient } from "@apollo/client";
import Button from "../components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import IconButton from "../components/IconButton";
import Header from "../components/Header";
import { useState } from "react";

function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const store = useStore();
  const client = useApolloClient();

  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

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

  const onLangValueChange = (lang: string) => {
    setSelectedLang(lang);
    if (Platform.OS === "android") {
      handleLanguageChange(lang);
    }
  };

  const handleLanguageChange = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("lang", lang);
  };

  return (
    <View style={styles.container}>
      <Header>
        <View style={styles.langContainer}>
          <RNPickerSelect
            placeholder={{}}
            value={selectedLang}
            onValueChange={onLangValueChange}
            onClose={() => handleLanguageChange(selectedLang)}
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
        {store.user && (
          <IconButton handlePress={handleLogout}>
            <MaterialIcons name="logout" color={Colors.black} size={dpx(20)} />
          </IconButton>
        )}
      </Header>
      {store.user ? (
        <View style={styles.actions}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{t("PROFILE.HELLO")},</Text>
            <Text style={styles.name}>
              {store.user.name} {store.user.surname}
            </Text>
          </View>
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
        <View style={styles.actions}>
          <Text style={styles.title}>{t("PROFILE.REGISTER_HERE")}</Text>
          <Button
            color={Colors.secondary}
            title={t("PROFILE.REGISTER")}
            onPress={handleRegister}
          />
          <Text style={[styles.title, styles.login]}>
            {t("PROFILE.YOU_NOT_LOGGIN_IN")}
          </Text>
          <Button
            color={Colors.primary}
            title={t("PROFILE.LOGIN")}
            onPress={handleLogin}
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
    paddingTop: dpx(10),
  },
  nameContainer: {
    flexDirection: "row",
  },
  name: {
    fontSize: dpx(16),
    fontFamily: "Montserrat_700Bold",
    marginLeft: dpx(10),
  },
  title: {
    fontSize: dpx(16),
    textAlign: "center",
    marginBottom: dpx(10),
    fontFamily: "Montserrat_500Medium",
  },
  login: {
    marginTop: dpx(30),
  },
  langContainer: {
    width: dpx(170),
    borderRadius: dpx(10),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  actions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
