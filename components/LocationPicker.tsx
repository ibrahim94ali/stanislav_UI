import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Dimensions, Modal, StyleSheet, View, Pressable } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Colors from "../constants/Colors";
import { customMapStyle } from "../constants/googleMapsStyle";
import { dpx } from "../constants/Spacings";
import Button from "./Button";

const LocationPicker = ({ addressGeoCode, onSave }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [geolocation, setGeolocation] = useState<number[]>(addressGeoCode);
  const [newGeolocation, setNewGeolocation] =
    useState<number[]>(addressGeoCode);

  useEffect(() => {
    setGeolocation(addressGeoCode);
    setNewGeolocation(addressGeoCode);
  }, [addressGeoCode]);

  const addMarker = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    if (coords) {
      setNewGeolocation([coords.latitude, coords.longitude]);
    }
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.smallMap}
        provider={PROVIDER_GOOGLE}
        customMapStyle={customMapStyle}
        loadingEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        onPress={() => setModalVisible(true)}
        region={{
          latitude: geolocation[0],
          longitude: geolocation[1],
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
      >
        <Marker
          coordinate={{
            latitude: geolocation[0],
            longitude: geolocation[1],
          }}
        >
          <Ionicons name="home" size={30} color={Colors.primary} />
        </Marker>
      </MapView>
      <Modal
        animationType="slide"
        visible={modalVisible}
        style={styles.modal}
        onRequestClose={() => setModalVisible(false)}
      >
        <MapView
          style={styles.map}
          loadingEnabled={true}
          rotateEnabled={false}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}
          onPress={(e) => addMarker(e)}
          initialRegion={{
            latitude: newGeolocation[0],
            longitude: newGeolocation[1],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: newGeolocation[0],
              longitude: newGeolocation[1],
            }}
          >
            <Ionicons name="home" size={30} color={Colors.primary} />
          </Marker>
        </MapView>
        <Pressable style={styles.close} onPress={() => setModalVisible(false)}>
          <Ionicons name="close" color={Colors.black} size={dpx(24)} />
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => {
            onSave(newGeolocation[0], newGeolocation[1]);
            setModalVisible(false);
          }}
        >
          <Button title="Save" />
        </Pressable>
      </Modal>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: dpx(10),
  },
  smallMap: {
    height: dpx(140),
    width: dpx(335),
    marginHorizontal: dpx(20),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dpx(40),
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  close: {
    position: "absolute",
    top: dpx(20),
    right: dpx(20),
    width: dpx(40),
    height: dpx(40),
    backgroundColor: "#fff",
    borderRadius: dpx(10),
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    position: "absolute",
    bottom: dpx(50),
    left: 20,
    right: 0,
    alignItems: "center",
    zIndex: 1,
  },
  modal: {
    margin: 0,
  },
});
