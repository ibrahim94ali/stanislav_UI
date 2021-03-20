import React, { useLayoutEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  Linking,
} from "react-native";
import { ApartmentI } from "../interfaces";
import Colors from "../constants/Colors";
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const ApartmentDetailsScreen = ({ route, navigation }: any) => {
  const { apartment }: { apartment: ApartmentI } = route.params;

  let images = apartment.photos.map((a) => {
    return {
      uri: a,
    };
  });

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: apartment.title,
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <View
        style={{
          marginVertical: 30,
          height: 130,
          marginHorizontal: 10,
          alignSelf: "center",
        }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {apartment.photos.map((photo, i) => (
            <View style={{ marginRight: 10 }} key={photo}>
              <TouchableOpacity
                onPress={() => {
                  setFullScreenPhotoIndex(i);
                  setIsFullScreen(true);
                }}
              >
                <Image
                  style={{
                    height: 130,
                    width: 130,
                    borderRadius: 10,
                    resizeMode: "cover",
                  }}
                  source={{
                    uri: photo,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <ImageView
          images={images}
          imageIndex={fullScreenPhotoIndex}
          visible={isFullScreen}
          swipeToCloseEnabled={false}
          onRequestClose={() => setIsFullScreen(false)}
        />
      </View>
      <View style={{ marginBottom: 20, width: 150, alignSelf: "center" }}>
        <Button
          title="See in Maps"
          color={Colors.secondary}
          onPress={() =>
            Linking.openURL(
              `http://maps.google.com/maps?z=18&q=${apartment.geolocation[0]},${apartment.geolocation[1]}`
            )
          }
        />
      </View>
      <ScrollView>
        <Text style={styles.item}>Info: {apartment.details}</Text>
        <Text style={styles.item}>
          Date: {new Date(+apartment.date).toDateString()}
        </Text>
        {/* <Text style={styles.item}>
          Lat: {apartment.geolocation[0]} Lon: {apartment.geolocation[1]}
        </Text> */}
        <Text style={styles.item}>Address: {apartment.address}</Text>
        <Text style={styles.item}>City: {apartment.city}</Text>
        <Text style={styles.item}>Price: {apartment.price} €</Text>
        <Text style={styles.item}>Type: {apartment.type}</Text>
        <Text style={styles.item}>Area: {apartment.msquare} meter square</Text>
        <Text style={styles.item}>Rooms: {apartment.roomCount}</Text>
        {apartment.owner ? (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{ alignSelf: "center", fontSize: 15, marginBottom: 10 }}
            >
              Owner details:{" "}
            </Text>
            <Text
              style={styles.title}
            >{`${apartment.owner.name} ${apartment.owner.surname}`}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                Linking.openURL(
                  `mailto:${apartment.owner?.email}?subject=Interest for ${apartment.title} in Stanislav&body=Hello, I am interested in your apartment "${apartment.title}".`
                )
              }
            >
              <Ionicons name="mail" size={18} color={Colors.white} />
              <Text style={{ marginLeft: 10, color: Colors.white }}>
                {apartment.owner.email}{" "}
              </Text>
            </TouchableOpacity>
            {apartment.owner.phone ? (
              <TouchableOpacity
                style={[styles.button, { marginTop: 10 }]}
                onPress={() => Linking.openURL(`tel:${apartment.owner?.phone}`)}
              >
                <FontAwesome name="phone" size={20} color={Colors.white} />
                <Text style={{ marginLeft: 10, color: Colors.white }}>
                  {apartment.owner.phone}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
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
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.secondary,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
