import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import { View, Text } from "../components/Themed";
import { REGISTER_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import { StoreData } from "../StoreContext";

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const store = StoreData();

  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");
  const [name, onNameChange] = useState("");
  const [surname, onSurnameChange] = useState("");

  const [createUser, { data }] = useMutation(REGISTER_USER);

  const handleSubmit = () => {
    createUser({
      variables: {
        email: email,
        password: password,
        name: name,
        surname: surname,
        phone: "123234",
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
        placeholder="Email"
        placeholderTextColor="#fff"
        textContentType="emailAddress"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onPasswordChange(text)}
        value={password}
        placeholder="Password"
        placeholderTextColor="#fff"
        secureTextEntry
        textContentType="password"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onNameChange(text)}
        value={name}
        placeholder="Name"
        placeholderTextColor="#fff"
        textContentType="name"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onSurnameChange(text)}
        value={surname}
        placeholder="Surname"
        placeholderTextColor="#fff"
        textContentType="name"
      ></TextInput>
      <View style={styles.buttonContainer}>
        <Button
          title="Register"
          onPress={handleSubmit}
          disabled={!email || !password || !name || !surname}
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
    borderColor: "#fff",
    borderWidth: 2,
    color: "#fff",
    padding: 10,
  },
  buttonContainer: {
    marginTop: 30,
  },
});
