import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { REGISTER_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const store = useStore();

  const { t } = useTranslation();
  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");
  const [confirmPassword, onConfirmPasswordChange] = useState("");
  const [name, onNameChange] = useState("");
  const [surname, onSurnameChange] = useState("");
  const [phone, onPhoneChange] = useState("");

  const [createUser, { data, loading }] = useMutation(REGISTER_USER);

  const handleSubmit = () => {
    createUser({
      variables: {
        email: email,
        password: password,
        name: name,
        surname: surname,
        phone: phone || null,
      },
    });
  };

  useEffect(() => {
    if (data) {
      storeUsereData(data.register);
    }
  }, [data]);

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
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loading && <LoadingSpinner />}
      <Text style={styles.title}>{t("PROFILE.REGISTER")}</Text>
      <ScrollView contentContainerStyle={styles.actions}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onEmailChange(text)}
          value={email}
          placeholder={t("REGISTER.EMAIL") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPasswordChange(text)}
          value={password}
          placeholder={t("REGISTER.PASSWORD") + " *"}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onConfirmPasswordChange(text)}
          value={confirmPassword}
          placeholder={t("REGISTER.CONFIRM_PASSWORD") + " *"}
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onNameChange(text)}
          value={name}
          placeholder={t("REGISTER.NAME") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="name"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onSurnameChange(text)}
          value={surname}
          placeholder={t("REGISTER.SURNAME") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="name"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPhoneChange(text)}
          value={phone}
          placeholder={t("REGISTER.PHONE") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          returnKeyType="done"
        ></TextInput>
        <View style={styles.buttonContainer}>
          <Button
            title={t("PROFILE.REGISTER")}
            color={Colors.primary}
            onPress={handleSubmit}
            disabled={
              !email ||
              !password ||
              !name ||
              !surname ||
              !phone ||
              password !== confirmPassword
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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
