import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBox from "../components/SearchBox";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { GET_FEATURED_APARTMENTS } from "../graphQL/Queries";
import City from "../components/City";
import { TouchableOpacity } from "react-native-gesture-handler";
import Property from "../components/Property";
import Sponsor from "../components/Sponsor";
import { ApartmentI } from "../interfaces";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import { cityTypes, sponsors } from "../constants/Selectable";
import { useTranslation } from "react-i18next";

function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data, loading: isDataLoading } = useQuery(GET_FEATURED_APARTMENTS);

  const handleSearch = (q: string) => {
    navigation.push("ApartmentListScreen", { q: q });
  };

  return (
    <View style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      {isFiltersOpen ? (
        <SearchForm
          closeFilters={() => setIsFiltersOpen(false)}
          goToProperties={() => navigation.push("ApartmentListScreen")}
        />
      ) : (
        <View style={styles.container}>
          <Header>
            <View style={styles.searchField}>
              <SearchBox searchTextEntered={(q: string) => handleSearch(q)} />
            </View>
            <IconButton handlePress={() => setIsFiltersOpen(!isFiltersOpen)}>
              <Ionicons name="options" color={Colors.black} size={dpx(24)} />
            </IconButton>
          </Header>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: dpx(20),
            }}
          >
            <View>
              <Text style={styles.header}>{t("HOME.CITIES")}</Text>
              <ScrollView
                style={styles.cityContainer}
                contentContainerStyle={{
                  paddingRight: dpx(20),
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {cityTypes.map((city) => (
                  <City
                    key={city.label}
                    title={city.label}
                    value={city.value}
                    url={city.url}
                    onPress={() => navigation.push("ApartmentListScreen")}
                  />
                ))}
              </ScrollView>
            </View>
            <View style={styles.propertiesContainer}>
              <View style={styles.propertiesHeaders}>
                <Text style={styles.header}>
                  {t("HOME.FEATURED_PROPERTIES")}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.push("ApartmentListScreen")}
                >
                  <Text style={styles.propertiesHeaderBtn}>
                    {t("HOME.SEE_ALL")}
                  </Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.propertyContainer}
                contentContainerStyle={{
                  paddingBottom: dpx(10),
                  paddingRight: dpx(20),
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {data &&
                  data.featuredApartments.map((apart: ApartmentI) => (
                    <View key={apart.id} style={styles.property}>
                      <Property apartment={apart} />
                    </View>
                  ))}
              </ScrollView>
            </View>
            <View style={styles.sponsorContainer}>
              <Text style={styles.header}>{t("HOME.SPONSORS")}</Text>
              <ScrollView
                style={styles.propertyContainer}
                contentContainerStyle={{
                  paddingRight: dpx(20),
                }}
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {sponsors.map((sponsor) => (
                  <Sponsor key={sponsor.name} {...sponsor} />
                ))}
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: dpx(10),
  },

  searchField: {
    flex: 1,
    marginRight: dpx(20),
  },

  cityContainer: {
    marginTop: dpx(10),
  },

  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
    marginLeft: dpx(20),
  },
  propertiesContainer: {
    marginTop: dpx(20),
  },
  propertiesHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: dpx(20),
  },
  propertiesHeaderBtn: {
    fontFamily: "Montserrat_700Bold",
    color: Colors.secondary,
    fontSize: dpx(14),
  },
  propertyContainer: {
    marginTop: dpx(10),
    overflow: "visible",
  },

  property: {
    width: dpx(270),
    height: dpx(270),
    marginLeft: dpx(20),
  },
  sponsorContainer: {
    marginTop: dpx(10),
  },
});
