import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import {
  AdType,
  AmenityType,
  BuildingType,
  CityType,
  HeatingType,
  SearchFiltersI,
} from "../interfaces";
import { ScrollView } from "react-native-gesture-handler";
import {
  adTypes,
  amenityTypes,
  buildingTypes,
  filterLimits,
  furnishingTypes,
  heatingTypes,
} from "../constants/Selectable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { useTranslation } from "react-i18next";
import { formatPrice } from "../helperMethods";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_CITIES } from "../graphQL/Queries";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import { Ionicons } from "@expo/vector-icons";
import FilterOptions from "../components/FilterOptions";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { filtersVar, setFilters } from "../Store";

const CustomSliderMarker = () => {
  return (
    <View style={styles.customSliderMarkerContainer}>
      <View style={styles.customSliderMarkerInside}></View>
    </View>
  );
};

const FiltersScreen = ({ navigation }: any) => {
  const { t } = useTranslation();

  const filters = useReactiveVar(filtersVar);

  const { data: cities, loading: isCityLoading } = useQuery(GET_CITIES);

  const placeholder = {
    label: t("FILTER_OPTIONS.ANY"),
    color: Colors.gray,
    value: undefined,
  };

  const { width: viewportWidth } = Dimensions.get("window");

  const [selectedCity, setSelectedCity] = useState<CityType | undefined>(
    filters.city
  );
  const [selectedBuildingType, setSelectedBuildingType] = useState<
    BuildingType | undefined
  >(filters.buildingType);
  const [selectedAdType, setSelectedAdType] = useState<AdType | undefined>(
    filters.adType
  );
  const [selectedHeatingType, setSelectedHeatingType] = useState<
    HeatingType | undefined
  >(filters.heatingType);
  const [selectedFurnishingType, setSelectedFurnishingType] = useState<
    boolean | undefined
  >(filters.isFurnished !== undefined ? filters.isFurnished : undefined);
  const [selectedAmenities, setSelectedAmenities] = useState<
    AmenityType[] | undefined
  >(filters.amenities !== undefined ? filters.amenities : undefined);

  //price
  const [minPrice, setMinPrice] = useState<number>(filters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(
    filters.maxPrice || filterLimits.maxPrice.purchase
  );

  const [age, setAge] = useState<number>(filters.age || filterLimits.maxAge);

  //area
  const [minArea, setMinArea] = useState<number>(filters.minArea || 0);
  const [maxArea, setMaxArea] = useState<number>(
    filters.maxArea || filterLimits.maxArea
  );

  // room
  const [minRoom, setMinRoom] = useState<number>(filters.minRoom || 0);
  const [maxRoom, setMaxRoom] = useState<number>(
    filters.maxRoom || filterLimits.maxRoom
  );

  // floor
  const [minFloor, setMinFloor] = useState<number>(filters.minFloor || 0);
  const [maxFloor, setMaxFloor] = useState<number>(
    filters.maxFloor || filterLimits.maxFloor
  );

  useEffect(() => {
    if (selectedAdType === AdType.RENT) {
      setMinPrice(minPrice < filterLimits.maxPrice.rent ? minPrice : 0);
      setMaxPrice(
        maxPrice > filterLimits.maxPrice.rent
          ? filterLimits.maxPrice.rent
          : maxPrice
      );
    } else {
      setMinPrice(
        (minPrice % filterLimits.maxPrice.purchase) / 40 === 0 ? minPrice : 0
      );
      setMaxPrice(
        maxPrice <= filterLimits.maxPrice.rent
          ? filterLimits.maxPrice.purchase
          : maxPrice
      );
    }
  }, [selectedAdType]);

  useEffect(() => {
    if (selectedBuildingType === BuildingType.LAND) {
      setSelectedFurnishingType(undefined);
      setSelectedHeatingType(undefined);
      setSelectedAmenities([]);
      setAge(filterLimits.maxAge);
      setMinRoom(0);
      setMaxRoom(filterLimits.maxRoom);
      setMinFloor(0);
      setMaxFloor(filterLimits.maxFloor);
    }
  }, [selectedBuildingType]);

  const showProperties = () => {
    const newFilters: SearchFiltersI = {
      city: selectedCity,
      buildingType: selectedBuildingType,
      adType: selectedAdType,
      heatingType: selectedHeatingType,
      amenities:
        selectedAmenities !== undefined && selectedAmenities.length > 0
          ? selectedAmenities
          : undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice:
        (selectedAdType === AdType.RENT &&
          maxPrice < filterLimits.maxPrice.rent) ||
        (selectedAdType !== AdType.RENT &&
          maxPrice < filterLimits.maxPrice.purchase)
          ? maxPrice
          : undefined,
      minArea: minArea > 0 ? minArea : undefined,
      maxArea: maxArea < filterLimits.maxArea ? maxArea : undefined,
      minRoom: minRoom > 0 ? minRoom : undefined,
      maxRoom: maxRoom < filterLimits.maxRoom ? maxRoom : undefined,
      minFloor: minFloor > 0 ? minFloor : undefined,
      maxFloor: maxFloor < filterLimits.maxFloor ? maxFloor : undefined,
      age: age < filterLimits.maxAge ? age : undefined,
      isFurnished:
        selectedFurnishingType !== undefined
          ? selectedFurnishingType
          : undefined,
    };
    setFilters(newFilters);

    storeFiltersLocally(newFilters);

    navigation.push("ApartmentListScreen");
  };

  const storeFiltersLocally = async (newFilters: SearchFiltersI) => {
    await AsyncStorage.setItem("filters", JSON.stringify(newFilters));
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {isCityLoading && <LoadingSpinner />}
      <Header>
        <View style={{ width: dpx(40) }}></View>
        <Text style={styles.header}>{t("SEARCH_FORM.FILTERS")}</Text>
        <IconButton handlePress={() => navigation.goBack()}>
          <Ionicons name="close" color={Colors.black} size={dpx(24)} />
        </IconButton>
      </Header>
      <ScrollView
        contentContainerStyle={{ paddingBottom: dpx(50) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.headerFilter}>{t("SEARCH_FORM.CITY")}</Text>
        <View style={styles.cityContainer}>
          <RNPickerSelect
            placeholder={placeholder}
            value={selectedCity}
            onValueChange={(itemValue: CityType | undefined) => {
              setSelectedCity(itemValue);
            }}
            items={cities.cities}
            style={pickerSelectStyles}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterOptions
            title={t("ADD_EDIT_APT.PROPERTY_TYPE")}
            any
            items={buildingTypes}
            value={selectedBuildingType}
            onValueChange={(itemValue: BuildingType | undefined) => {
              setSelectedBuildingType(itemValue);
            }}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterOptions
            title={t("ADD_EDIT_APT.AD_TYPE")}
            any
            items={adTypes}
            value={selectedAdType}
            onValueChange={(itemValue: AdType | undefined) => {
              setSelectedAdType(itemValue);
            }}
          />
        </View>
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.filterContainer}>
            <FilterOptions
              title={t("ADD_EDIT_APT.FURNISHING")}
              any
              items={furnishingTypes}
              value={selectedFurnishingType}
              onValueChange={(itemValue: boolean | undefined) => {
                setSelectedFurnishingType(itemValue);
              }}
            />
          </View>
        )}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.filterContainer}>
            <FilterOptions
              title={t("ADD_EDIT_APT.HEATING")}
              any
              items={heatingTypes}
              value={selectedHeatingType}
              onValueChange={(itemValue: HeatingType | undefined) => {
                setSelectedHeatingType(itemValue);
              }}
            />
          </View>
        )}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.filterContainer}>
            <FilterOptions
              title={t("ADD_EDIT_APT.AMENITIES")}
              any
              multiple
              items={amenityTypes}
              value={selectedAmenities || []}
              onValueChange={(itemValues: AmenityType[]) => {
                setSelectedAmenities(itemValues);
              }}
            />
          </View>
        )}

        {/* price */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>
            {t("ADD_EDIT_APT.FIELDS.PRICE")}
          </Text>
          <Text style={styles.sliderValues}>
            {minPrice === 0 &&
            ((selectedAdType === AdType.RENT &&
              maxPrice === filterLimits.maxPrice.rent) ||
              (selectedAdType !== AdType.RENT &&
                maxPrice === filterLimits.maxPrice.purchase))
              ? t("FILTER_OPTIONS.ANY")
              : minPrice > 0 &&
                ((selectedAdType === AdType.RENT &&
                  maxPrice < filterLimits.maxPrice.rent) ||
                  (selectedAdType !== AdType.RENT &&
                    maxPrice < filterLimits.maxPrice.purchase))
              ? formatPrice(minPrice) + " - " + formatPrice(maxPrice) + " €"
              : minPrice > 0
              ? `${t("FILTER_OPTIONS.MIN")} ${formatPrice(minPrice)} €`
              : `${t("FILTER_OPTIONS.MAX")} ${formatPrice(maxPrice)} €`}
          </Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={
              selectedAdType === AdType.RENT
                ? filterLimits.maxPrice.rent
                : filterLimits.maxPrice.purchase
            }
            step={
              selectedAdType === AdType.RENT
                ? filterLimits.maxPrice.rent / 40
                : filterLimits.maxPrice.purchase / 40
            }
            sliderLength={viewportWidth * 0.85}
            customMarker={() => {
              return <CustomSliderMarker />;
            }}
            values={[minPrice, maxPrice]}
            onValuesChange={([min, max]) => {
              setMinPrice(min);
              setMaxPrice(max);
            }}
          />
        </View>

        {/* area */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>
            {t("ADD_EDIT_APT.FIELDS.AREA")}
          </Text>
          <Text style={styles.sliderValues}>
            {minArea === 0 && maxArea === filterLimits.maxArea
              ? t("FILTER_OPTIONS.ANY")
              : minArea > 0 && maxArea < filterLimits.maxArea
              ? minArea + " - " + maxArea + " m2"
              : minArea > 0
              ? `${t("FILTER_OPTIONS.MIN")} ${minArea} m2`
              : `${t("FILTER_OPTIONS.MAX")} ${maxArea} m2`}
          </Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={filterLimits.maxArea}
            step={10}
            sliderLength={viewportWidth * 0.85}
            customMarker={() => {
              return <CustomSliderMarker />;
            }}
            values={[minArea, maxArea]}
            onValuesChange={([min, max]) => {
              setMinArea(min);
              setMaxArea(max);
            }}
          />
        </View>

        {/* age */}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderHeader}>
              {t("ADD_EDIT_APT.FIELDS.AGE")}
            </Text>
            <Text style={styles.sliderValues}>
              {age > 0 && age < filterLimits.maxAge
                ? `${t("FILTER_OPTIONS.MAX")} ${age}`
                : age < filterLimits.maxAge
                ? t("ADD_EDIT_APT.FIELDS.NEW")
                : t("FILTER_OPTIONS.ANY")}
            </Text>
          </View>
        )}

        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderFilters}>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              min={0}
              max={filterLimits.maxAge}
              step={1}
              sliderLength={viewportWidth * 0.85}
              customMarker={() => {
                return <CustomSliderMarker />;
              }}
              values={[age]}
              onValuesChange={([age]) => {
                setAge(age);
              }}
            />
          </View>
        )}

        {/* room */}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderHeader}>
              {t("ADD_EDIT_APT.FIELDS.ROOMS")}
            </Text>
            <Text style={styles.sliderValues}>
              {minRoom === 0 && maxRoom === filterLimits.maxRoom
                ? t("FILTER_OPTIONS.ANY")
                : minRoom > 0 && maxRoom < filterLimits.maxRoom
                ? minRoom + " - " + maxRoom
                : minRoom > 0
                ? `${t("FILTER_OPTIONS.MIN")} ${minRoom}`
                : `${t("FILTER_OPTIONS.MAX")} ${maxRoom}`}
            </Text>
          </View>
        )}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderFilters}>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              min={0}
              max={filterLimits.maxRoom}
              step={1}
              sliderLength={viewportWidth * 0.85}
              customMarker={() => {
                return <CustomSliderMarker />;
              }}
              values={[minRoom, maxRoom]}
              onValuesChange={([min, max]) => {
                setMinRoom(min);
                setMaxRoom(max);
              }}
            />
          </View>
        )}

        {/* floor */}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderTextContainer}>
            <Text style={styles.sliderHeader}>
              {t("ADD_EDIT_APT.FIELDS.FLOOR")}
            </Text>
            <Text style={styles.sliderValues}>
              {minFloor === 0 && maxFloor === filterLimits.maxFloor
                ? t("FILTER_OPTIONS.ANY")
                : minFloor > 0 && maxFloor < filterLimits.maxFloor
                ? minFloor + " - " + maxFloor
                : minFloor > 0
                ? `${t("FILTER_OPTIONS.MIN")} ${minFloor}`
                : `${t("FILTER_OPTIONS.MAX")} ${maxFloor}`}
            </Text>
          </View>
        )}
        {selectedBuildingType !== BuildingType.LAND && (
          <View style={styles.sliderFilters}>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              min={0}
              max={filterLimits.maxFloor}
              step={1}
              sliderLength={viewportWidth * 0.85}
              values={[minFloor, maxFloor]}
              customMarker={() => {
                return <CustomSliderMarker />;
              }}
              onValuesChange={([min, max]) => {
                setMinFloor(min);
                setMaxFloor(max);
              }}
            />
          </View>
        )}
      </ScrollView>
      <View style={styles.bigBtn}>
        <Button
          title={t("SEARCH_FORM.SHOW_RESULTS")}
          full
          onPress={() => showProperties()}
        ></Button>
      </View>
    </SafeAreaView>
  );
};

export default FiltersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  headerFilter: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.black,
    marginLeft: dpx(20),
  },
  filterContainer: {
    marginBottom: dpx(20),
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: dpx(5),
    paddingHorizontal: dpx(5),
  },
  itemText: {
    flex: 1,
  },
  picker: {
    flex: 1,
    color: Colors.black,
  },
  sliderTextContainer: {
    marginBottom: dpx(10),
    marginHorizontal: dpx(20),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sliderHeader: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.black,
  },
  sliderValues: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.primary,
  },
  sliderFilters: {
    alignItems: "center",
    paddingVertical: dpx(5),
    paddingHorizontal: dpx(5),
  },
  slider: {
    backgroundColor: Colors.primary,
  },
  bigBtn: {
    position: "absolute",
    bottom: 0,
  },
  customSliderMarkerContainer: {
    width: dpx(23),
    height: dpx(23),
    backgroundColor: Colors.primary,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  customSliderMarkerInside: {
    backgroundColor: Colors.bg,
    width: dpx(17),
    height: dpx(17),
    borderRadius: 100,
  },
  cityContainer: {
    marginVertical: dpx(10),
    alignSelf: "stretch",
    marginHorizontal: dpx(20),
    borderRadius: dpx(10),
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
});
