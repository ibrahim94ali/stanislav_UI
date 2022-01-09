import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import NoResult from "../components/NoResult";
import Property from "../components/Property";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { GET_MY_APARTMENTS } from "../graphQL/Queries";
import { ApartmentI } from "../interfaces";

const MyApartmentsScreen = ({ navigation }: any) => {
  const { t } = useTranslation();
  const { data: myApartments, loading: loadingApartments } =
    useQuery(GET_MY_APARTMENTS);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {loadingApartments ? <LoadingSpinner /> : null}
      <Header>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>{t("PROFILE.YOUR_APT")}</Text>
        <IconButton
          handlePress={() => navigation.push("AddEditApartmentScreen")}
        >
          <Ionicons name="add" color={Colors.black} size={dpx(24)} />
        </IconButton>
      </Header>

      {myApartments && myApartments.myApartments?.length === 0 && <NoResult />}

      <ScrollView
        style={styles.propertyContainer}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        {myApartments &&
          myApartments.myApartments.map((apart: ApartmentI) => (
            <View key={apart.id} style={styles.property}>
              <Property apartment={apart} showActions />
            </View>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyApartmentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  propertyContainer: {
    marginTop: dpx(10),
  },
  property: {
    width: dpx(330),
    height: dpx(270),
    marginBottom: dpx(20),
  },
});
