import { useMutation } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { Button, StyleSheet, TextInput, View, Text } from "react-native";
import { LOGIN_USER } from "../graphQL/Mutations";
import { UserI } from "../interfaces";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";

export default function LoginScreen({ navigation }: { navigation: any }) {
  const store = useStore();
  const [email, onEmailChange] = useState("");
  const [password, onPasswordChange] = useState("");

  const [loginUser, { data }] = useMutation(LOGIN_USER);

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
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onEmailChange(text)}
        value={email}
        placeholder="Email"
        textContentType="emailAddress"
        keyboardType="email-address"
      ></TextInput>
      <TextInput
        style={styles.input}
        onChangeText={(text) => onPasswordChange(text)}
        value={password}
        placeholder="Password"
        secureTextEntry
        textContentType="password"
      ></TextInput>
      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={handleSubmit}
          disabled={!email || !password}
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
