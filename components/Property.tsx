import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { ApartmentI } from "../interfaces";
import { useNavigation } from "@react-navigation/core";
import PropertyDetails from "./PropertyDetails";

const Property = ({
  apartment,
  showActions = false,
}: {
  apartment: ApartmentI;
  showActions?: Boolean;
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() =>
        navigation.navigate(
          "ApartmentDetailsScreen" as never,
          {
            id: apartment.id,
            apartmentParamData: apartment,
            showActions,
          } as never
        )
      }
    >
      <View style={styles.photo}>
        <Image
          source={{ uri: apartment.photos[0] }}
          style={{ width: "100%", height: "100%" }}
        />
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
    height: dpx(125),
    resizeMode: "cover",
    overflow: "hidden",
    borderTopLeftRadius: dpx(10),
    borderTopRightRadius: dpx(10),
  },
});
