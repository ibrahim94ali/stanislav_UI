import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Colors from "../constants/Colors";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { formatPrice } from "../helperMethods";
import { AdType, ApartmentI } from "../interfaces";

const MapScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { data } = useQuery(GET_APARTMENTS);

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
        {data?.apartments.map((apartment: ApartmentI) => (
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
              navigation.push("ApartmentDetailsScreen", { apartment })
            }
          >
            <Ionicons name="home" size={30} color={Colors.primary} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

export default observer(MapScreen);

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
