import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Linking,
  Alert,
} from "react-native";
import { AmenityType, ApartmentI, BuildingType } from "../interfaces";
import Colors from "../constants/Colors";
import ImageView from "react-native-image-viewing";
import {
  AntDesign,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { gql, useMutation, useReactiveVar } from "@apollo/client";
import {
  ADD_FAV_APARTMENT,
  DELETE_APARTMENT,
  REMOVE_FAV_APARTMENT,
} from "../graphQL/Mutations";
import { dpx } from "../constants/Spacings";
import { GET_FAV_APARTMENTS } from "../graphQL/Queries";
import LoadingSpinner from "../components/LoadingSpinner";
import PropertyDetails from "../components/PropertyDetails";
import IconButton from "../components/IconButton";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  furnishingTypes,
  wheelChairAccessibleTypes,
} from "../constants/Selectable";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import { customMapStyle } from "../constants/googleMapsStyle";
import { userVar } from "../Store";

const ApartmentDetailsScreen = ({ route, navigation }: any) => {
  const {
    apartment,
    showActions,
    isFavorite,
  }: {
    apartment: ApartmentI;
    showActions: Boolean;
    isFavorite: Boolean;
  } = route.params;

  const [isFav, setIsFav] = useState(isFavorite || apartment.isFavorite);

  let images = apartment.photos.map((a) => {
    return {
      uri: a,
    };
  });

  const { t } = useTranslation();

  const user = useReactiveVar(userVar);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullScreenPhotoIndex, setFullScreenPhotoIndex] = useState(0);

  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const [addFavorite, { data: isNowFavorite, loading: loadingFavorite }] =
    useMutation(ADD_FAV_APARTMENT, {
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

  const [deleteApartment, { data: deletedApartment, loading: loadingDelete }] =
    useMutation(DELETE_APARTMENT, {
      update(cache, { data }) {
        const myDeletedApartmentId: string = data?.deleteApartment.id;

        if (!myDeletedApartmentId) return;

        cache.evict({
          id: `Apartment:${myDeletedApartmentId}`,
        });
        cache.gc();
      },
    });

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
    Alert.alert(t("DELETE_MODAL.TITLE"), t("DELETE_MODAL.MSG"), [
      {
        text: t("CANCEL"),
      },
      {
        text: t("OK"),
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

  const redirectToMap = (apartment: ApartmentI) => {
    Linking.openURL(
      `http://maps.google.com/maps?z=16&q=${apartment.geolocation[0]},${apartment.geolocation[1]}`
    );
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

  const handlePhotosOnScroll = (event: any) => {
    const activeIndex = parseInt(
      (event.nativeEvent.contentOffset.x / dpx(375)).toFixed(0)
    );

    if (activeIndex !== activePhotoIndex) {
      setActivePhotoIndex(activeIndex);
    }
  };

  const amenityRender = (amenity: AmenityType) => {
    return (
      <View style={styles.amenityContainer} key={amenity}>
        <MaterialCommunityIcons
          name={
            amenity === AmenityType.POOL ||
            amenity === AmenityType.PARKING ||
            amenity === AmenityType.FIREPLACE
              ? (amenity as any)
              : amenity === AmenityType.GARDEN
              ? "leaf"
              : amenity === AmenityType.PET_FRIENDLY
              ? "paw"
              : amenity === AmenityType.LIFT
              ? "elevator-passenger"
              : "star"
          }
          size={dpx(18)}
          color={Colors.black}
        />
        <Text style={styles.amenity}>{t(`FILTER_OPTIONS.${amenity}`)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {(loadingFavorite || loadingUnfavorite || loadingDelete) && (
        <LoadingSpinner />
      )}
      <ScrollView>
        <ScrollView
          horizontal
          pagingEnabled
          onScroll={(e) => handlePhotosOnScroll(e)}
          showsHorizontalScrollIndicator={false}
        >
          {apartment.photos.map((photo, i) => (
            <View key={photo}>
              <TouchableOpacity
                onPress={() => {
                  setFullScreenPhotoIndex(i);
                  setIsFullScreen(true);
                }}
              >
                <Image
                  style={styles.photo}
                  source={{
                    uri: photo,
                  }}
                />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.actionBtnContainer}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" color={Colors.white} size={dpx(25)} />
          </TouchableOpacity>
          {showActions ? (
            <View style={styles.actionBtns}>
              <TouchableOpacity
                style={[styles.actionBtnContainer, { marginRight: dpx(10) }]}
                onPress={() => handleEdit()}
              >
                <AntDesign name="edit" color={Colors.white} size={dpx(25)} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtnContainer,
                  { backgroundColor: "rgba(255,61,0,0.3)" },
                ]}
                onPress={() => handleDelete()}
              >
                <AntDesign name="delete" color={Colors.white} size={dpx(25)} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionBtns}>
              {user && (
                <TouchableOpacity
                  style={styles.actionBtnContainer}
                  onPress={() => handleFavorite()}
                >
                  <Ionicons
                    name="heart"
                    color={isFav ? Colors.secondary : Colors.white}
                    size={dpx(25)}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <View style={styles.photoIndexIndicatorContainer}>
          {apartment.photos.map((photo, i) => (
            <View
              key={photo}
              style={[
                styles.photoIndexIndicator,
                i == activePhotoIndex
                  ? styles.photoIndexIndicatorActive
                  : styles.photoIndexIndicatorPassive,
              ]}
            ></View>
          ))}
        </View>
        <ImageView
          images={images}
          imageIndex={fullScreenPhotoIndex}
          visible={isFullScreen}
          swipeToCloseEnabled={false}
          presentationStyle="overFullScreen"
          onRequestClose={() => setIsFullScreen(false)}
        />
        <View style={styles.propertyDetailsContainer}>
          <PropertyDetails apartment={apartment} />
        </View>
        <MapView
          style={styles.map}
          loadingEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}
          onPress={() => redirectToMap(apartment)}
          region={{
            latitude: apartment.geolocation[0],
            longitude: apartment.geolocation[1],
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: apartment.geolocation[0],
              longitude: apartment.geolocation[1],
            }}
            onPress={() => redirectToMap(apartment)}
          >
            <Ionicons name="home" size={30} color={Colors.primary} />
          </Marker>
        </MapView>
        <View style={styles.descContainer}>
          <Text style={styles.title}>{t("APARTMENT_DETAILS.DESCRIPTION")}</Text>
          <Text style={styles.details}>{apartment.details}</Text>
        </View>
        {apartment.buildingType !== BuildingType.LAND && (
          <View style={styles.amenitiesContainer}>
            <Text style={styles.title}>{t("APARTMENT_DETAILS.AMENITIES")}</Text>
            <View style={styles.amenityRow}>
              <View style={styles.amenityContainer}>
                <MaterialIcons
                  name="house"
                  size={dpx(18)}
                  color={Colors.black}
                />
                <Text style={styles.amenity}>
                  {apartment.age === 0
                    ? t("ADD_EDIT_APT.FIELDS.NEW")
                    : `${apartment.age} ${t("ADD_EDIT_APT.FIELDS.YEARS")}`}
                </Text>
              </View>
              <View style={styles.amenityContainer}>
                <MaterialCommunityIcons
                  name="sofa"
                  size={dpx(18)}
                  color={Colors.black}
                />
                <Text style={styles.amenity}>
                  {t(
                    `APARTMENT_DETAILS.FURNISHINGTYPE.${
                      furnishingTypes.find(
                        (f) => f.value === apartment.isFurnished
                      )?.label
                    }`
                  )}
                </Text>
              </View>
            </View>
            <View style={styles.amenityRow}>
              <View style={styles.amenityContainer}>
                <MaterialCommunityIcons
                  name="fire"
                  size={dpx(18)}
                  color={Colors.black}
                />
                <Text style={styles.amenity}>
                  {t(`FILTER_OPTIONS.${apartment.heatingType}`)}
                  {` ${t("ADD_EDIT_APT.HEATING")}`}
                </Text>
              </View>
              <View style={styles.amenityContainer}>
                <MaterialCommunityIcons
                  name="wheelchair-accessibility"
                  size={dpx(18)}
                  color={Colors.black}
                />
                <Text style={styles.amenity}>
                  {t(
                    `APARTMENT_DETAILS.WHEELCHAIRACCESSIBILITYTYPE.${
                      wheelChairAccessibleTypes.find(
                        (a) => a.value === apartment.isWheelChairAccessible
                      )?.label
                    }`
                  )}
                </Text>
              </View>
            </View>
            {apartment.amenities?.map((_, index: number) => {
              const am = apartment.amenities;
              if (index % 2 === 0) {
                return (
                  <View
                    style={styles.amenityRow}
                    key={apartment.amenities[index]}
                  >
                    {am.length > index &&
                      amenityRender(apartment.amenities[index])}
                    {am.length > index + 1 &&
                      amenityRender(apartment.amenities[index + 1])}
                  </View>
                );
              }
            })}
          </View>
        )}
        {!showActions && (
          <View style={styles.agentContainer}>
            <Text style={styles.title}>
              {t("APARTMENT_DETAILS.LISTING_AGENT")}
            </Text>

            <View style={styles.personContainer}>
              <Text
                style={styles.person}
              >{`${apartment.owner?.name} ${apartment.owner?.surname}`}</Text>
              <View style={styles.personIcons}>
                <IconButton
                  handlePress={() =>
                    Linking.openURL(`tel:${apartment.owner?.phone}`)
                  }
                >
                  <Entypo name="phone" color={Colors.black} size={dpx(22)} />
                </IconButton>
                <View style={{ marginLeft: dpx(10) }}>
                  <IconButton
                    handlePress={() =>
                      Linking.openURL(
                        `mailto:${apartment.owner?.email}?subject=Interest for ${apartment.title} in Stanislav&body=Hello, I am interested in your apartment "${apartment.title}".`
                      )
                    }
                  >
                    <MaterialCommunityIcons
                      name="email"
                      color={Colors.black}
                      size={dpx(22)}
                    />
                  </IconButton>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ApartmentDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  photo: {
    resizeMode: "cover",
    height: dpx(230),
    width: dpx(375),
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: dpx(20),
    position: "absolute",
    top: dpx(40),
    right: 0,
    left: 0,
  },
  actionBtnContainer: {
    width: dpx(40),
    height: dpx(40),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(51,51,51,0.3)",
    borderRadius: dpx(10),
  },
  actionBtns: {
    flexDirection: "row",
    alignItems: "center",
  },
  photoIndexIndicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    top: dpx(210),
    left: 0,
    right: 0,
    alignItems: "center",
  },
  photoIndexIndicator: {
    width: dpx(10),
    height: dpx(10),
    borderRadius: dpx(20),
    marginRight: dpx(10),
  },
  photoIndexIndicatorPassive: {
    backgroundColor: Colors.gray,
  },
  photoIndexIndicatorActive: {
    backgroundColor: Colors.white,
  },

  propertyDetailsContainer: {
    flex: 1,
    padding: dpx(10),
  },
  map: {
    height: dpx(140),
    width: dpx(335),
    marginHorizontal: dpx(20),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: dpx(40),
  },
  descContainer: {
    padding: dpx(20),
    paddingBottom: 0,
  },
  amenitiesContainer: {
    padding: dpx(20),
    paddingBottom: 0,
  },
  amenityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: dpx(10),
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },

  amenityContainer: {
    flexDirection: "row",
    paddingBottom: dpx(10),
    alignItems: "center",
    flex: 1,
  },
  amenity: {
    marginLeft: dpx(5),
    fontSize: dpx(12),
    fontFamily: "Montserrat_400Regular",
    color: Colors.black,
  },
  agentContainer: {
    padding: dpx(20),
  },
  personContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  person: {
    fontFamily: "Montserrat_700Bold",
    fontSize: dpx(16),
    color: Colors.black,
  },
  personIcons: {
    flexDirection: "row",
  },
  title: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
    marginBottom: dpx(10),
  },
  details: {
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
    color: Colors.black,
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
