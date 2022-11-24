import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React, { useState } from "react";
import { dpx, height } from "../constants/Spacings";
import Colors from "../constants/Colors";
import IconButton from "./IconButton";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const scrollHeight = height - 170;

interface Option {
  label: string;
  value: any;
}

interface Props {
  value: any;
  onValueChange: (lang: any) => void;
  items: Option[];
  labelContainerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  showAny?: boolean;
}

const Selection = (props: Props) => {
  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((prev) => !prev);
  const selectedValue = (value: any) => {
    props.onValueChange(value);
    setShow(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleShow} style={props.labelContainerStyle}>
        <Text
          style={[
            {
              textTransform: "capitalize",
            },
            props.labelStyle ?? styles.defaultLabelStyle,
          ]}
        >
          {props.value}
        </Text>
      </TouchableOpacity>

      <Modal animationType="fade" visible={show}>
        <View style={styles.modal}>
          <IconButton
            handlePress={() => setShow(false)}
            style={styles.closeIcon}
          >
            <Ionicons name="close" color={Colors.black} size={dpx(24)} />
          </IconButton>
          <ScrollView
            style={{
              maxHeight: scrollHeight,
              marginTop: dpx(20),
            }}
          >
            {props.showAny && (
              <TouchableOpacity
                onPress={() => selectedValue(undefined)}
                style={styles.option}
              >
                <Text style={[styles.optionText, { color: Colors.gray }]}>
                  {t("FILTER_OPTIONS.ANY")}
                </Text>
              </TouchableOpacity>
            )}
            {props.items.map((option) => (
              <TouchableOpacity
                onPress={() => selectedValue(option.value)}
                style={styles.option}
                key={option.value}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default Selection;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    right: dpx(20),
    top: dpx(50),
    zIndex: 1,
  },
  defaultLabelStyle: {
    paddingVertical: dpx(10),
    paddingLeft: dpx(10),
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
    color: Colors.black,
  },
  modal: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: Colors.bg,
  },
  option: {
    paddingVertical: dpx(10),
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },

  optionText: {
    fontSize: dpx(14),
    fontFamily: "Montserrat_500Medium",
    color: Colors.black,
    textAlign: "center",
  },
});
