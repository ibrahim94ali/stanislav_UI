import React, { useEffect, useLayoutEffect, useState } from "react";
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
import { observer } from "mobx-react";
import { useMutation } from "@apollo/client";
import { ADD_FAV_APARTMENT, REMOVE_FAV_APARTMENT } from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";

const ApartmentDetailsScreen = ({ route, navigation }: any) => {
  const { apartment }: { apartment: ApartmentI } = route.params;

  const [isFav, setIsFav] = useState(apartment.isFavorite);

  let images = apartment.photos.map((a) => {
    return {
      uri: a,
    };
  });

  const store = useStore();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  const [addFavorite, { data: isNowFavorite }] = useMutation(
    ADD_FAV_APARTMENT,
    {
      variables: {
        id: apartment.id,
      },
    }
  );
  const [removeFavorite, { data: isNowUnfavorite }] = useMutation(
    REMOVE_FAV_APARTMENT,
    {
      variables: {
        id: apartment.id,
      },
    }
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: apartment.title,
      headerRight: () =>
        store.user ? (
          <TouchableOpacity onPress={() => handleFavorite()}>
            <Ionicons
              size={30}
              style={{ marginRight: 15 }}
              color={Colors.primary}
              name={isFav ? "heart" : "heart-outline"}
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, isFav]);

  const handleFavorite = () => {
    if (isFav) {
      removeFavorite();
    } else {
      addFavorite();
    }
  };

  useEffect(() => {
    if (isNowFavorite?.addFavorite) {
      store.setFavoriteApartments(isNowFavorite.addFavorite);
      setIsFav(true);
    }
  }, [isNowFavorite]);

  useEffect(() => {
    if (isNowUnfavorite?.removeFavorite) {
      store.setFavoriteApartments(isNowUnfavorite.removeFavorite);
      setIsFav(false);
    }
  }, [isNowUnfavorite]);

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
        <Text style={styles.item}>Building Type: {apartment.buildingType}</Text>
        <Text style={styles.item}>Ad Type: {apartment.adType}</Text>
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
        <Text style={styles.item}>Area: {apartment.msquare} meter square</Text>
        <Text style={styles.item}>Rooms: {apartment.roomCount}</Text>
        <Text style={styles.item}>Floor: {apartment.floor}</Text>
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

export default observer(ApartmentDetailsScreen);

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
