import { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { AdType, ApartmentI } from "../interfaces";

const PropertyDetails = ({ apartment }: { apartment: ApartmentI }) => {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.detailsHeaders}>
        <View style={styles.detailsHeadersType}>
          <Ionicons
            name="pricetag-outline"
            color={Colors.secondary}
            size={dpx(14)}
          />
          <Text style={styles.typeName}>{apartment.buildingType}</Text>
        </View>
        <Text style={styles.adType}>For {apartment.adType}</Text>
      </View>
      <Text style={styles.header}>{apartment.title}</Text>
      {apartment.adType === AdType.RENT ? (
        <Text style={styles.price}>{apartment.price} € / Month</Text>
      ) : (
        <Text style={styles.price}>{apartment.price} €</Text>
      )}
      <Text style={styles.address}>{apartment.address}</Text>
      <View style={styles.iconsContainer}>
        <View style={styles.iconContainer}>
          <Entypo name="ruler" color={Colors.black} size={dpx(14)} />
          <Text style={styles.iconText}>{apartment.msquare} m2</Text>
        </View>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="floor-plan"
            color={Colors.black}
            size={dpx(18)}
          />
          <Text style={styles.iconText}>{apartment.roomCount} rooms</Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="layers-outline" color={Colors.black} size={dpx(18)} />
          <Text style={styles.iconText}>{apartment.floor}. floor</Text>
        </View>
      </View>
    </View>
  );
};

export default PropertyDetails;

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    padding: dpx(10),
  },
  detailsHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailsHeadersType: {
    flexDirection: "row",
    alignItems: "center",
  },
  typeName: {
    fontFamily: "Montserrat_700Bold",
    fontSize: dpx(14),
    color: Colors.secondary,
    marginLeft: dpx(5),
    textTransform: "capitalize",
  },
  adType: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(12),
    color: Colors.secondary,
    textTransform: "capitalize",
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.black,
    marginTop: dpx(5),
  },
  price: {
    fontFamily: "Montserrat_700Bold",
    fontSize: dpx(16),
    color: Colors.black,
    marginTop: dpx(5),
  },
  address: {
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(12),
    color: Colors.gray,
    marginTop: dpx(5),
  },
  iconsContainer: {
    marginTop: dpx(5),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconText: {
    marginLeft: dpx(5),
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(12),
    color: Colors.black,
  },
});
