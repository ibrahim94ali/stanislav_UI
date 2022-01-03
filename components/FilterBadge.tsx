import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

interface Props {
  label: string;
  value: any;
  isActive: boolean;
  onValueChange: any;
}

const FilterBadge = (props: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        props.onValueChange(!props.isActive ? props.value : null);
      }}
    >
      <View
        style={[styles.container, props.isActive && styles.isActiveContainer]}
      >
        <Text style={[styles.text, props.isActive && styles.isActiveText]}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FilterBadge;

const styles = StyleSheet.create({
  container: {
    paddingVertical: dpx(10),
    paddingHorizontal: dpx(15),
    borderRadius: dpx(10),
    borderColor: Colors.lightGray,
    borderWidth: 1,
    marginLeft: dpx(10),
  },
  text: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(13),
    color: Colors.black,
  },
  isActiveContainer: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  isActiveText: {
    color: Colors.white,
  },
});
