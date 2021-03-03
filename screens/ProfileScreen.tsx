import * as React from "react";
import { Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import { useStore } from "../hooks/StoreContext";
import { observer } from "mobx-react";

function ProfileScreen({ navigation }: { navigation: any }) {
  const store = useStore();

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
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      {store.user ? (
        <View>
          <Text style={styles.title}>You are already logged in</Text>
          <Button title="Logout" onPress={handleLogout} />
          <Text style={[styles.title, { marginTop: 50 }]}>
            Create new Apartment
          </Text>
          <Button
            title="Create Apartment"
            onPress={() => navigation.navigate("NewApartmentFormScreen")}
          />
          <Text style={[styles.title, { marginTop: 50 }]}>
            Manage Your Apartments
          </Text>
          <Button
            title="See Your Apartments"
            onPress={() => navigation.navigate("HomeScreen")}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>You are not logged in</Text>
          <Button title="Login" onPress={handleLogin} />
          <Text style={[styles.title, styles.register]}>
            Please register here
          </Text>
          <Button title="Register" onPress={handleRegister} />
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
    marginBottom: 10,
  },
  register: {
    marginTop: 30,
  },
});
