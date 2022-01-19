import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";

interface Props {
  searchTextEntered: (q: string) => void;
}

const SearchBox = (props: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Ionicons name="search" color={Colors.black} size={dpx(22)} />
      <TextInput
        style={styles.text}
        value={search}
        placeholder={t("HOME.SEARCH_PROPERTY") + "..."}
        placeholderTextColor={Colors.gray}
        onChangeText={(value) => setSearch(value)}
        onEndEditing={() => {
          props.searchTextEntered(search);
          setSearch("");
        }}
        returnKeyType="search"
        returnKeyLabel="Search"
      />
    </View>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: dpx(6),
    paddingHorizontal: dpx(20),
    borderColor: Colors.lightGray,
    borderWidth: 1,
    borderRadius: dpx(10),
  },
  text: {
    color: Colors.black,
    fontFamily: "Montserrat_400Regular",
    fontSize: dpx(14),
    marginLeft: dpx(10),
    flex: 1,
  },
});
