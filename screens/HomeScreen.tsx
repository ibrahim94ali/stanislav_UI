import { useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import IconButton from "../components/IconButton";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBox from "../components/SearchBox";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import {
  GET_APARTMENTS,
  GET_FEATURED_APARTMENTS,
  GET_POPULAR_CITIES,
  GET_SPONSORS,
} from "../graphQL/Queries";
import City from "../components/City";
import { TouchableOpacity } from "react-native-gesture-handler";
import Property from "../components/Property";
import Sponsor from "../components/Sponsor";
import { ApartmentI, CityI, SponsorI } from "../interfaces";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetFilters } from "../Store";

function HomeScreen({ navigation }: any) {
  const { t } = useTranslation();

  const { data: featuredProperties, loading: isFeaturedPropertyLoading } =
    useQuery(GET_FEATURED_APARTMENTS);
  const { data: allProperties, loading: isAllPropertyLoading } = useQuery(
    GET_APARTMENTS,
    {
      variables: {
        limit: 10,
      },
      fetchPolicy: "no-cache",
    }
  );
  const { data: popularCities, loading: isCityLoading } =
    useQuery(GET_POPULAR_CITIES);
  const { data: sponsors, loading: isSponsorLoading } = useQuery(GET_SPONSORS);

  const handleSearch = (q: string) => {
    navigation.push("ApartmentListScreen", { q: q });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {isFeaturedPropertyLoading ||
      isAllPropertyLoading ||
      isCityLoading ||
      isSponsorLoading ? (
        <LoadingSpinner />
      ) : null}
      <View style={styles.container}>
        <Header>
          <View style={styles.searchField}>
            <SearchBox searchTextEntered={(q: string) => handleSearch(q)} />
          </View>
          <IconButton handlePress={() => navigation.push("FiltersScreen")}>
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
            <Text style={styles.header}>{t("HOME.POPULAR_CITIES")}</Text>
            <ScrollView
              style={styles.cityContainer}
              contentContainerStyle={{
                paddingRight: dpx(20),
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {popularCities &&
                popularCities.popularCities?.map((city: CityI) => (
                  <City
                    key={city.label}
                    {...city}
                    onPress={() => navigation.push("ApartmentListScreen")}
                  />
                ))}
            </ScrollView>
          </View>
          <View style={styles.propertiesContainer}>
            <View style={styles.propertiesHeaders}>
              <Text style={styles.header}>{t("HOME.FEATURED_PROPERTIES")}</Text>
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
              {featuredProperties &&
                featuredProperties.featuredApartments.map(
                  (apart: ApartmentI) => (
                    <View key={apart.id} style={styles.property}>
                      <Property apartment={apart} />
                    </View>
                  )
                )}
            </ScrollView>
          </View>
          {/* All Properties */}
          <View style={styles.allPropertiesContainer}>
            <View style={styles.propertiesHeaders}>
              <Text style={[styles.header, styles.featuredPropertiesHeader]}>
                {t("HOME.ALL_PROPERTIES")}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  resetFilters();
                  navigation.push("ApartmentListScreen");
                }}
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
              {allProperties &&
                allProperties.apartments.map((apart: ApartmentI) => (
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
              {sponsors &&
                sponsors.sponsors?.map((sponsor: SponsorI) => (
                  <Sponsor key={sponsor.name} {...sponsor} />
                ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
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
    marginTop: dpx(30),
  },
  allPropertiesContainer: {
    marginTop: dpx(20),
  },
  propertiesHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: dpx(20),
  },
  featuredPropertiesHeader: {
    maxWidth: dpx(250),
  },
  propertiesHeaderBtn: {
    fontFamily: "Montserrat_700Bold",
    color: Colors.secondary,
    flex: 1,
    fontSize: dpx(14),
  },
  propertyContainer: {
    marginTop: dpx(10),
    overflow: "visible",
  },
  property: {
    width: dpx(270),
    minHeight: dpx(270),
    marginLeft: dpx(20),
  },
  sponsorContainer: {
    marginTop: dpx(20),
  },
});
