import { StyleSheet } from "react-native";
import Colors from "./Colors";
import { dpx } from "./Spacings";

export const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: dpx(14),
    fontFamily: "Montserrat_500Medium",
    paddingHorizontal: dpx(10),
    paddingVertical: dpx(10),
    borderRadius: dpx(4),
    color: Colors.black,
  },
  inputAndroid: {
    fontSize: dpx(14),
    fontFamily: "Montserrat_500Medium",
    color: Colors.black,
  },
  placeholder: {
    color: Colors.gray,
  },
});
