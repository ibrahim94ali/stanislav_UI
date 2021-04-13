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

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const store = useStore();

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
    <View style={styles.container}>
      {loading && <LoadingSpinner />}
      <Text style={styles.title}>Register</Text>
      <ScrollView contentContainerStyle={styles.actions}>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onEmailChange(text)}
          value={email}
          placeholder="Email *"
          placeholderTextColor={Colors.gray}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPasswordChange(text)}
          value={password}
          placeholder="Password *"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onConfirmPasswordChange(text)}
          value={confirmPassword}
          placeholder="Confirm Password *"
          placeholderTextColor={Colors.gray}
          secureTextEntry
          textContentType="password"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onNameChange(text)}
          value={name}
          placeholder="Name *"
          placeholderTextColor={Colors.gray}
          textContentType="name"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onSurnameChange(text)}
          value={surname}
          placeholder="Surname *"
          placeholderTextColor={Colors.gray}
          textContentType="name"
        ></TextInput>
        <TextInput
          style={styles.input}
          onChangeText={(text) => onPhoneChange(text)}
          value={phone}
          placeholder="Phone"
          placeholderTextColor={Colors.gray}
          textContentType="telephoneNumber"
          keyboardType="number-pad"
          returnKeyType="done"
        ></TextInput>
        <View style={styles.buttonContainer}>
          <Button
            title="Register"
            color={Colors.primary}
            onPress={handleSubmit}
            disabled={
              !email ||
              !password ||
              !name ||
              !surname ||
              password !== confirmPassword
            }
          />
        </View>
      </ScrollView>
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
