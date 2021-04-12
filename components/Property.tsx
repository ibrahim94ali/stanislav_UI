import React from "react";
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { ApartmentI } from "../interfaces";
import { useNavigation } from "@react-navigation/core";
import PropertyDetails from "./PropertyDetails";

const Property = ({
  apartment,
  showActions = false,
  isFavorite = false,
}: {
  apartment: ApartmentI;
  showActions?: Boolean;
  isFavorite?: Boolean;
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate("ApartmentDetailsScreen", {
          apartment,
          showActions,
          isFavorite,
        })
      }
    >
      <View style={styles.photo}>
        <ImageBackground
          source={{ uri: apartment.photos[0] }}
          style={{ width: "100%", height: "100%" }}
        ></ImageBackground>
      </View>
      <PropertyDetails apartment={apartment} />
    </TouchableOpacity>
  );
};

export default Property;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: dpx(10),
    shadowColor: Colors.black,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.25,
    elevation: 3,
  },
  photo: {
    flex: 1,
    resizeMode: "cover",
    overflow: "hidden",
    borderTopLeftRadius: dpx(10),
    borderTopRightRadius: dpx(10),
  },
});
