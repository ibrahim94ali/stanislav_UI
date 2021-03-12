import React, { useLayoutEffect, useState } from "react";
import { Image, StyleSheet, ScrollView, Text, View } from "react-native";
import { ApartmentI } from "../interfaces";
import Colors from "../constants/Colors";
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from "react-native";

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
    color: Colors.white,
  },
});
