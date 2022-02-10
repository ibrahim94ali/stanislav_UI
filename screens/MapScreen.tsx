import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Dimensions, Text, Platform } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import Colors from "../constants/Colors";
import { customMapStyle } from "../constants/googleMapsStyle";
import { dpx } from "../constants/Spacings";
import { GET_APARTMENTS_FOR_MAPS } from "../graphQL/Queries";
import { formatPrice } from "../helperMethods";
import { AdType, ApartmentI } from "../interfaces";
import LoadingSpinner from "../components/LoadingSpinner";

interface MapRegionCoordinates {
  westLng: number;
  southLat: number;
  eastLng: number;
  northLat: number;
}

const initialRegionForMap = {
  latitude: 41.8,
  longitude: 21.2,
  latitudeDelta: 1,
  longitudeDelta: 1,
};

const initialRegionCoordinates = {
  westLng: 20.69999970495701,
  southLat: 41.04483366347347,
  eastLng: 21.69999998062849,
  northLat: 42.55022659900675,
};

const MapScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const [regionCoordinates, setRegionCoordinates] =
    useState<MapRegionCoordinates>(() => initialRegionCoordinates);

  const { data, loading, refetch } = useQuery(GET_APARTMENTS_FOR_MAPS, {
    variables: {
      ...initialRegionCoordinates,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const blurSubscription = navigation.addListener("blur", () => {
      refetch({
        westLng: 0,
        southLat: 0,
        eastLng: 0,
        northLat: 0,
      });
    });

    const focusSubscription = navigation.addListener("focus", () => {
      refetch({
        ...regionCoordinates,
      });
    });

    return () => {
      blurSubscription();
      focusSubscription();
    };
  }, [navigation]);

  const handleRegionChange = (region: Region) => {
    const westLng = region.longitude - region.longitudeDelta / 2; // westLng - min lng
    const southLat = region.latitude - region.latitudeDelta / 2; // southLat - min lat
    const eastLng = region.longitude + region.longitudeDelta / 2; // eastLng - max lng
    const northLat = region.latitude + region.latitudeDelta / 2; // northLat - max lat

    setRegionCoordinates({
      westLng,
      southLat,
      eastLng,
      northLat,
    });

    refetch({
      westLng,
      southLat,
      eastLng,
      northLat,
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={customMapStyle}
          onRegionChangeComplete={handleRegionChange}
          initialRegion={initialRegionForMap}
        >
          {data?.getApartmentsForMaps?.map((apartment: ApartmentI) => (
            <Marker
              key={apartment.id}
              coordinate={{
                latitude: apartment.geolocation[0],
                longitude: apartment.geolocation[1],
              }}
              title={apartment.title}
              description={`${formatPrice(apartment.price)} € ${
                apartment.adType === AdType.RENT
                  ? "/ " + t("PROPERTY_DETAILS.MONTH")
                  : ""
              }`}
              onCalloutPress={() =>
                navigation.push("ApartmentDetailsScreen", {
                  id: apartment.id,
                })
              }
            >
              {Platform.OS === "ios" && (
                <Callout
                  style={styles.calloutContainer}
                  onPress={() =>
                    navigation.push("ApartmentDetailsScreen", {
                      id: apartment.id,
                    })
                  }
                >
                  <Text style={styles.calloutTitle}>{apartment.title}</Text>
                  <Text style={styles.calloutDescription}>{`${formatPrice(
                    apartment.price
                  )} € ${
                    apartment.adType === AdType.RENT
                      ? "/ " + t("PROPERTY_DETAILS.MONTH")
                      : ""
                  }`}</Text>
                </Callout>
              )}
              <Ionicons name="home" size={30} color={Colors.primary} />
            </Marker>
          ))}
        </MapView>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - dpx(30),
  },
  calloutContainer: {
    width: dpx(200),
  },
  calloutTitle: {
    fontFamily: "Montserrat_700Bold",
    fontSize: dpx(14),
    marginBottom: dpx(5),
  },
  calloutDescription: {
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(12),
  },
});
