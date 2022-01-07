import React from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { useStore } from "../hooks/StoreContext";
import { CityType, SearchFiltersI } from "../interfaces";

interface Props {
  title: string;
  value: CityType;
  url: string;
  onPress: any;
}

const City = (props: Props) => {
  const store = useStore();
  const goToCity = () => {
    store.resetFilters();
    const newFilters: SearchFiltersI = {
      ...store.filters,
      city: props.value,
    };
    store.setFilters(newFilters);
    props.onPress();
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => goToCity()}>
      <ImageBackground
        source={{ uri: props.url }}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          borderTopLeftRadius: dpx(10),
          borderTopRightRadius: dpx(10),
          borderBottomLeftRadius: dpx(10),
          borderBottomRightRadius: dpx(10),
          overflow: "hidden",
          opacity: 0.5,
        }}
      ></ImageBackground>
      <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
  );
};

export default City;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    width: dpx(250),
    height: dpx(120),
    marginLeft: dpx(20),

    backgroundColor:
      "linear-gradient(0deg, rgba(51, 51, 51, 0.7), rgba(51, 51, 51, 0.7))",

    borderRadius: dpx(10),
  },
  title: {
    fontSize: dpx(25),
    fontFamily: "Montserrat_700Bold",
    color: Colors.white,
  },
  btn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: dpx(8),
    paddingHorizontal: dpx(20),
    backgroundColor: Colors.white,
    borderRadius: dpx(10),
  },
  btnText: {
    fontFamily: "Montserrat_400Regular",
    color: Colors.black,
    fontSize: dpx(14),
    marginRight: dpx(5),
  },
});
