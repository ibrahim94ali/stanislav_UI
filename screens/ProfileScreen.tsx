import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { useTranslation } from "react-i18next";
import { dpx } from "../constants/Spacings";
import { useApolloClient, useReactiveVar } from "@apollo/client";
import Button from "../components/Button";
import { MaterialIcons } from "@expo/vector-icons";
import IconButton from "../components/IconButton";
import Header from "../components/Header";
import { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { setUser, userVar } from "../Store";
import Selection from "../components/Selection";

function ProfileScreen({ navigation }: any) {
  const { t, i18n } = useTranslation();
  const client = useApolloClient();
  const user = useReactiveVar(userVar);

  const [selectedLang, setSelectedLang] = useState(i18n.language || "en");

  const handleRegister = () => {
    navigation.push("RegisterScreen");
  };

  const handleLogin = () => {
    navigation.push("LoginScreen");
  };

  const handleLogout = async () => {
    setUser(null);
    await client.clearStore();
  };

  const onLangValueChange = async (lang: any) => {
    setSelectedLang(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("lang", lang);
  };

  const languageLabel = useCallback(() => {
    switch (selectedLang) {
      case "mk":
        return "Македонски";
      case "sq":
        return "Shqip";
      case "tr":
        return "Türkçe";
      default:
        return "English";
    }
  }, [selectedLang]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <Header>
        <Selection
          value={languageLabel()}
          onValueChange={onLangValueChange}
          labelContainerStyle={styles.langContainer}
          labelStyle={styles.langItem}
          items={[
            { label: "English", value: "en" },
            { label: "Македонски", value: "mk" },
            { label: "Shqip", value: "sq" },
            { label: "Türkçe", value: "tr" },
          ]}
        />
        {user && (
          <IconButton handlePress={handleLogout}>
            <MaterialIcons name="logout" color={Colors.black} size={dpx(20)} />
          </IconButton>
        )}
      </Header>
      {user ? (
        <View style={styles.actions}>
          <View style={styles.nameContainer}>
            <Text style={styles.title}>{t("PROFILE.HELLO")},</Text>
            <Text style={styles.name}>{user.name}</Text>
          </View>
          <Text style={[styles.title, { marginTop: 50 }]}>
            {t("PROFILE.MANAGE_YOUR_PROFILE")}
          </Text>
          <Button
            title={t("PROFILE.YOUR_PROFILE")}
            color={Colors.primary}
            onPress={() =>
              navigation.push("RegisterScreen", { isEditing: true })
            }
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
    </SafeAreaView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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
  langItem: {
    fontSize: dpx(14),
    fontFamily: "Montserrat_500Medium",
    color: Colors.black,
    padding: dpx(10),
  },
  actions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
