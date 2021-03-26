import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Button,
  Linking,
  Alert,
} from "react-native";
import { ApartmentI } from "../interfaces";
import Colors from "../constants/Colors";
import ImageView from "react-native-image-viewing";
import { TouchableOpacity } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import { gql, useMutation } from "@apollo/client";
import {
  ADD_FAV_APARTMENT,
  DELETE_APARTMENT,
  REMOVE_FAV_APARTMENT,
} from "../graphQL/Mutations";
import { useStore } from "../hooks/StoreContext";
import { dpx } from "../constants/Spacings";
import { GET_FAV_APARTMENTS } from "../graphQL/Queries";
import LoadingSpinner from "../components/LoadingSpinner";

const ApartmentDetailsScreen = ({ route, navigation }: any) => {
  const {
    apartment,
    showActions,
  }: { apartment: ApartmentI; showActions: Boolean } = route.params;

  const [isFav, setIsFav] = useState(apartment.isFavorite);

  let images = apartment.photos.map((a) => {
    return {
      uri: a,
    };
  });

  const store = useStore();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  const [
    addFavorite,
    { data: isNowFavorite, loading: loadingFavorite },
  ] = useMutation(ADD_FAV_APARTMENT, {
    variables: {
      id: apartment.id,
    },
    update(cache, { data }) {
      const favoriteApartment: ApartmentI = data?.addFavorite;
      if (!favoriteApartment) return;

      cache.writeFragment({
        id: `Apartment:${favoriteApartment.id}`,
        fragment: gql`
          fragment apartments on Apartment {
            isFavorite
          }
        `,
        data: {
          isFavorite: true,
        },
      });

      const favoritesCache = cache.readQuery<{
        favorites: ApartmentI[];
      }>({
        query: GET_FAV_APARTMENTS,
      });

      if (favoritesCache) {
        cache.writeQuery({
          query: GET_FAV_APARTMENTS,
          data: {
            favorites: [favoriteApartment, ...favoritesCache?.favorites],
          },
        });
      }
    },
  });
  const [
    removeFavorite,
    { data: isNowUnfavorite, loading: loadingUnfavorite },
  ] = useMutation(REMOVE_FAV_APARTMENT, {
    variables: {
      id: apartment.id,
    },
    update(cache, { data }) {
      const favoriteApartmentId: string = data?.removeFavorite.id;
      if (!favoriteApartmentId) return;

      cache.writeFragment({
        id: `Apartment:${favoriteApartmentId}`,
        fragment: gql`
          fragment apartments on Apartment {
            isFavorite
          }
        `,
        data: {
          isFavorite: false,
        },
      });

      const favoritesCache = cache.readQuery<{
        favorites: ApartmentI[];
      }>({
        query: GET_FAV_APARTMENTS,
      });

      if (favoritesCache) {
        cache.modify({
          fields: {
            favorites(existingRefs, { readField }) {
              return existingRefs.filter(
                (existingRefs: any) =>
                  favoriteApartmentId !== readField("id", existingRefs)
              );
            },
          },
        });
      }
    },
  });

  const [
    deleteApartment,
    { data: deletedApartment, loading: loadingDelete },
  ] = useMutation(DELETE_APARTMENT, {
    update(cache, { data }) {
      const myDeletedApartmentId: string = data?.deleteApartment.id;

      if (!myDeletedApartmentId) return;

      cache.evict({
        id: `Apartment:${myDeletedApartmentId}`,
      });
      cache.gc();
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: apartment.title,
      headerRight: () =>
        store.user ? (
          showActions ? (
            <View style={{ flexDirection: "row", marginRight: dpx(20) }}>
              <TouchableOpacity onPress={() => handleEdit()}>
                <FontAwesome
                  size={30}
                  style={{ marginRight: dpx(20) }}
                  color={Colors.black}
                  name="edit"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete()}>
                <FontAwesome size={30} color={Colors.red} name="trash" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => handleFavorite()}>
              <Ionicons
                size={30}
                style={{ marginRight: 15 }}
                color={Colors.primary}
                name={isFav ? "heart" : "heart-outline"}
              />
            </TouchableOpacity>
          )
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

  const handleEdit = () => {
    navigation.navigate("AddEditApartmentScreen", { itemOnEdit: apartment });
  };

  const handleDelete = () => {
    Alert.alert("Are you sure", "This apartment will be deleted permenantely", [
      {
        text: "Cancel",
      },
      {
        text: "OK",
        onPress: () => {
          deleteApartment({
            variables: {
              id: apartment.id,
            },
          });
        },
      },
    ]);
  };

  useEffect(() => {
    if (isNowFavorite?.addFavorite) {
      setIsFav(true);
    }
  }, [isNowFavorite]);

  useEffect(() => {
    if (isNowUnfavorite?.removeFavorite) {
      setIsFav(false);
    }
  }, [isNowUnfavorite]);

  useEffect(() => {
    if (deletedApartment) {
      navigation.pop();
    }
  }, [deletedApartment]);

  return (
    <View style={styles.container}>
      {loadingFavorite || loadingUnfavorite || loadingDelete ? (
        <LoadingSpinner />
      ) : null}
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
