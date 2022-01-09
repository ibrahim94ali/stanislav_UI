import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { LOGIN_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const store = useStore();
  const { t } = useTranslation();
  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");

  const [loginUser, { data, loading }] = useMutation(LOGIN_USER);

  useEffect(() => {
    if (data) {
      storeUsereData(data.login);
    }
  }, [data]);

  const handleSubmit = () => {
    loginUser({
      variables: {
        email: email,
        password: password,
      },
    });
  };

  const storeUsereData = async (value: UserI) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("user", jsonValue);
      store.setUser(value);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingSpinner />}
      <Text style={styles.title}>{t("PROFILE.LOGIN")}</Text>
      <View style={styles.actions}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onEmailChange(text)}
          value={email}
          placeholder={t("REGISTER.EMAIL")}
          placeholderTextColor={Colors.gray}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPasswordChange(text)}
          value={password}
          placeholder={t("REGISTER.PASSWORD")}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
        ></TextInput>
        <View style={styles.buttonContainer}>
          <Button
            title={t("PROFILE.LOGIN")}
            color={Colors.primary}
            onPress={handleSubmit}
            disabled={!email || !password}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: dpx(16),
    fontFamily: "Montserrat_500Medium",
    marginTop: dpx(40),
    textAlign: "center",
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "90%",
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: dpx(10),
    color: Colors.black,
    padding: dpx(10),
    marginBottom: dpx(10),
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
  },
  buttonContainer: {
    marginTop: 30,
  },
});
