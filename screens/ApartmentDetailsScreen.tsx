import React, { useLayoutEffect } from "react";
import {
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ApartmentI } from "../interfaces";
import Colors from "../constants/Colors";

const ApartmentDetailsScreen = ({ route, navigation }: any) => {
  const { apartment }: { apartment: ApartmentI } = route.params;

  const { width } = Dimensions.get("window");
  const height = width * 0.5;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: apartment.title,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 50, width, height }}>
        <ScrollView pagingEnabled horizontal style={{ width, height }}>
          {apartment.photos.map((photo, index) => (
            <Image
              key={index}
              style={{ width, height }}
              source={{
                uri: photo,
              }}
            />
          ))}
        </ScrollView>
      </View>
      <View>
        <Text style={styles.item}>Info: {apartment.details}</Text>
        <Text style={styles.item}>
          Date: {new Date(+apartment.date).toDateString()}
        </Text>
        <Text style={styles.item}>
          Lat: {apartment.geolocation[0]} Lon: {apartment.geolocation[1]}
        </Text>
        <Text style={styles.item}>Address: {apartment.address}</Text>
        <Text style={styles.item}>City: {apartment.city}</Text>
        <Text style={styles.item}>Price: {apartment.price} €</Text>
        <Text style={styles.item}>Type: {apartment.type}</Text>
        <Text style={styles.item}>Area: {apartment.msquare} meter square</Text>
        <Text style={styles.item}>Rooms: {apartment.roomCount}</Text>
      </View>
    </View>
  );
};

export default ApartmentDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  item: {
    fontSize: 18,
    backgroundColor: Colors.primary,
    padding: 5,
    marginBottom: 5,
  },
});
