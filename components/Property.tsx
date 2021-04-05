import React from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_700Bold,
} from "@expo-google-fonts/montserrat";
import AppLoading from "expo-app-loading";
import { Ionicons, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { AdType, ApartmentI } from "../interfaces";

const Property = ({ apartment }: { apartment: ApartmentI }) => {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        <ImageBackground
          source={{ uri: apartment.photos[0] }}
          style={{ width: "100%", height: "100%" }}
        ></ImageBackground>
      </View>
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
          <Text style={styles.price}>{apartment.price} € / Month</Text>
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
            <Ionicons
              name="layers-outline"
              color={Colors.black}
              size={dpx(18)}
            />
            <Text style={styles.iconText}>{apartment.floor}. floor</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Property;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: dpx(10),
    marginLeft: dpx(20),

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
  },
  adType: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(12),
    color: Colors.secondary,
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
