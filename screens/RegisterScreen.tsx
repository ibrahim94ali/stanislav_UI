import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { REGISTER_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { ScrollView } from "react-native-gesture-handler";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { Ionicons } from "@expo/vector-icons";
import { setUser } from "../Store";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const { t } = useTranslation();
  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");
  const [confirmPassword, onConfirmPasswordChange] = useState("");
  const [name, onNameChange] = useState("");
  const [surname, onSurnameChange] = useState("");
  const [phone, onPhoneChange] = useState("");

  //refs for inputs
  const ref_password = useRef<TextInput>();
  const ref_confirmPassword = useRef<TextInput>();
  const ref_name = useRef<TextInput>();
  const ref_surname = useRef<TextInput>();
  const ref_phone = useRef<TextInput>();

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
      setUser(value);
      navigation.goBack();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loading && <LoadingSpinner />}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.title}>{t("PROFILE.REGISTER")}</Text>
        <View style={{ width: dpx(40) }}></View>
      </Header>
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
          returnKeyType="next"
          autoFocus
          onSubmitEditing={() => ref_password.current?.focus()}
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
          returnKeyType="next"
          onSubmitEditing={() => ref_confirmPassword.current?.focus()}
          ref={ref_password as any}
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
          returnKeyType="next"
          onSubmitEditing={() => ref_name.current?.focus()}
          ref={ref_confirmPassword as any}
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onNameChange(text)}
          value={name}
          placeholder={t("REGISTER.NAME") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => ref_surname.current?.focus()}
          ref={ref_name as any}
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onSurnameChange(text)}
          value={surname}
          placeholder={t("REGISTER.SURNAME") + " *"}
          placeholderTextColor={Colors.gray}
          textContentType="name"
          returnKeyType="next"
          onSubmitEditing={() => ref_phone.current?.focus()}
          ref={ref_surname as any}
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
          ref={ref_phone as any}
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
              phone.length < 9 ||
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
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  actions: {
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
