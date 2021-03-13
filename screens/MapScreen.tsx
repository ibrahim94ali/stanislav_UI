import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { useStore } from "../hooks/StoreContext";
export default function MapScreen({ navigation }: any) {
  const store = useStore();
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        loadingEnabled
        region={{
          latitude: 41.8,
          longitude: 21.3,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
      >
        {store.apartments.map((apartment) => (
          <Marker
            key={apartment.id}
            coordinate={{
              latitude: apartment.geolocation[0],
              longitude: apartment.geolocation[1],
            }}
            title={apartment.title}
            description={`Price: ${apartment.price} €`}
            onCalloutPress={() =>
              navigation.push("ApartmentDetailsScreen", { apartment })
            }
          >
            <Ionicons name="home" size={30} color={Colors.primary} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
