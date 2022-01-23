import React from "react";
import { ImageBackground, Linking, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { dpx } from "../constants/Spacings";

interface Props {
  name: string;
  logoUrl: string;
  redirectUrl: string;
}

const Sponsor = (props: Props) => {
  const goToSponsor = () => {
    Linking.openURL(props.redirectUrl);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={() => goToSponsor()}>
      <ImageBackground
        source={{ uri: props.logoUrl }}
        style={{
          width: "100%",
          height: "100%",
          borderTopLeftRadius: dpx(10),
          borderTopRightRadius: dpx(10),
          borderBottomLeftRadius: dpx(10),
          borderBottomRightRadius: dpx(10),
          overflow: "hidden",
        }}
      ></ImageBackground>
    </TouchableOpacity>
  );
};

export default Sponsor;

const styles = StyleSheet.create({
  container: {
    width: dpx(80),
    height: dpx(80),
    backgroundColor: "rgba(200, 200, 200, 0.2)",
    borderRadius: dpx(10),
    marginLeft: dpx(20),
  },
});
