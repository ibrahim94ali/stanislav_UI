import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useStore } from "../hooks/StoreContext";
import { observer } from "mobx-react";
import Colors from "../constants/Colors";

function ProfileScreen({ navigation }: any) {
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
          <Text style={styles.title}>
            Hello, {store.user.name} {store.user.surname}
          </Text>
          <Button
            title="Logout"
            onPress={handleLogout}
            color={Colors.secondary}
          />
          <Text style={[styles.title, { marginTop: 50 }]}>
            Manage Your Apartments
          </Text>
          <Button
            title="Your Apartments"
            color={Colors.primary}
            onPress={() => navigation.push("MyApartmentsScreen")}
          />
          <Text style={[styles.title, { marginTop: 50 }]}>
            See Your Favorite Apartments
          </Text>
          <Button
            title="Favorite Apartments"
            color={Colors.primary}
            onPress={() => navigation.push("MyFavoriteApartmentsScreen")}
          />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>You are not logged in</Text>
          <Button color={Colors.primary} title="Login" onPress={handleLogin} />
          <Text style={[styles.title, styles.register]}>
            Please register here
          </Text>
          <Button
            color={Colors.secondary}
            title="Register"
            onPress={handleRegister}
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
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 10,
  },
  register: {
    marginTop: 30,
  },
});
