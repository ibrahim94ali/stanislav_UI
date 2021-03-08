import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { REGISTER_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const store = useStore();

  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");
  const [confirmPassword, onConfirmPasswordChange] = useState("");
  const [name, onNameChange] = useState("");
  const [surname, onSurnameChange] = useState("");
  const [phone, onPhoneChange] = useState("");

  const [createUser, { data }] = useMutation(REGISTER_USER);

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
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onEmailChange(text)}
        value={email}
        placeholder="Email *"
        textContentType="emailAddress"
        keyboardType="email-address"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onPasswordChange(text)}
        value={password}
        placeholder="Password *"
        secureTextEntry
        textContentType="password"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onConfirmPasswordChange(text)}
        value={confirmPassword}
        placeholder="Confirm Password *"
        secureTextEntry
        textContentType="password"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onNameChange(text)}
        value={name}
        placeholder="Name *"
        textContentType="name"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onSurnameChange(text)}
        value={surname}
        placeholder="Surname *"
        textContentType="name"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onPhoneChange(text)}
        value={phone}
        placeholder="Phone"
        textContentType="telephoneNumber"
        keyboardType="number-pad"
      ></TextInput>
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
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
    </View>
  );
}

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
    marginBottom: 50,
  },
  input: {
    width: "80%",
    borderColor: Colors.black,
    borderWidth: 2,
    color: Colors.black,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
