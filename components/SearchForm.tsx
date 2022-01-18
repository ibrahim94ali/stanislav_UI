import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useStore } from "../hooks/StoreContext";
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
  cityTypes,
  furnishingTypes,
  heatingTypes,
} from "../constants/Selectable";
import Header from "./Header";
import IconButton from "./IconButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./Button";
import FilterOptions from "./FilterOptions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNPickerSelect from "react-native-picker-select";
import { pickerSelectStyles } from "../constants/PickerStyle";
import { useTranslation } from "react-i18next";

const CustomSliderMarker = () => {
  return (
    <View style={styles.customSliderMarkerContainer}>
      <View style={styles.customSliderMarkerInside}></View>
    </View>
  );
};

const SearchForm = ({ closeFilters, goToProperties }: any) => {
  const store = useStore();
  const { t } = useTranslation();

  const placeholder = {
    label: t("FILTER_OPTIONS.ANY"),
    color: Colors.gray,
    value: undefined,
  };

  const { width: viewportWidth } = Dimensions.get("window");

  const [selectedCity, setSelectedCity] = useState<CityType | undefined>(
    store.filters.city
  );
  const [selectedBuildingType, setSelectedBuildingType] = useState<
    BuildingType | undefined
  >(store.filters.buildingType);
  const [selectedAdType, setSelectedAdType] = useState<AdType | undefined>(
    store.filters.adType
  );
  const [selectedHeatingType, setSelectedHeatingType] = useState<
    HeatingType | undefined
  >(store.filters.heatingType);
  const [selectedFurnishingType, setSelectedFurnishingType] = useState<
    boolean | undefined
  >(
    store.filters.isFurnished !== undefined
      ? store.filters.isFurnished
      : undefined
  );
  const [selectedAmenities, setSelectedAmenities] = useState<
    AmenityType[] | undefined
  >(
    store.filters.amenities !== undefined ? store.filters.amenities : undefined
  );

  //price
  const [minPrice, setMinPrice] = useState<number>(store.filters.minPrice || 0);
  const [maxPrice, setMaxPrice] = useState<number>(
    store.filters.maxPrice || 1000000
  );

  //area
  const [minArea, setMinArea] = useState<number>(store.filters.minArea || 0);
  const [maxArea, setMaxArea] = useState<number>(store.filters.maxArea || 300);

  // room
  const [minRoom, setMinRoom] = useState<number>(store.filters.minRoom || 0);
  const [maxRoom, setMaxRoom] = useState<number>(store.filters.maxRoom || 10);

  // floor
  const [minFloor, setMinFloor] = useState<number>(store.filters.minFloor || 0);
  const [maxFloor, setMaxFloor] = useState<number>(
    store.filters.maxFloor || 30
  );

  useEffect(() => {
    if (selectedAdType === AdType.RENT) {
      setMinPrice(minPrice < 1000 ? minPrice : 0);
      setMaxPrice(maxPrice > 1000 ? 1000 : maxPrice);
    } else {
      setMinPrice(minPrice % 50000 === 0 ? minPrice : 0);
      setMaxPrice(maxPrice <= 1000 ? 1000000 : maxPrice);
    }
  }, [selectedAdType]);

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
        (selectedAdType === AdType.RENT && maxPrice < 1000) ||
        (selectedAdType === AdType.PURCHASE && maxPrice < 1000000)
          ? maxPrice
          : undefined,
      minArea: minArea > 0 ? minArea : undefined,
      maxArea: maxArea < 300 ? maxArea : undefined,
      minRoom: minRoom > 0 ? minRoom : undefined,
      maxRoom: maxRoom < 10 ? maxRoom : undefined,
      minFloor: minFloor > 0 ? minFloor : undefined,
      maxFloor: maxFloor < 30 ? maxFloor : undefined,
      isFurnished:
        selectedFurnishingType !== undefined
          ? selectedFurnishingType
          : undefined,
    };
    store.setFilters(newFilters);

    storeFiltersLocally(newFilters);

    goToProperties();
  };

  const storeFiltersLocally = async (newFilters: SearchFiltersI) => {
    await AsyncStorage.setItem("filters", JSON.stringify(newFilters));
  };

  return (
    <View style={styles.container}>
      <Header>
        <IconButton handlePress={() => store.resetFilters()}>
          <MaterialCommunityIcons name="restart" size={24} color="black" />
        </IconButton>
        <Text style={styles.header}>{t("SEARCH_FORM.FILTERS")}</Text>
        <IconButton handlePress={() => closeFilters()}>
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
            onValueChange={(itemValue: CityType) => {
              setSelectedCity(itemValue);
            }}
            items={cityTypes}
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

        {/* price */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>
            {t("ADD_EDIT_APT.FIELDS.PRICE")}
          </Text>
          <Text style={styles.sliderValues}>
            {minPrice + " - " + maxPrice + " €"}
          </Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={selectedAdType === AdType.RENT ? 1000 : 1000000}
            step={selectedAdType === AdType.RENT ? 50 : 50000}
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
            {minArea + " - " + maxArea + " m2"}
          </Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={300}
            step={20}
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

        {/* room */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>
            {t("ADD_EDIT_APT.FIELDS.ROOMS")}
          </Text>
          <Text style={styles.sliderValues}>{minRoom + " - " + maxRoom}</Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={10}
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

        {/* floor */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>
            {t("ADD_EDIT_APT.FIELDS.FLOOR")}
          </Text>
          <Text style={styles.sliderValues}>{minFloor + " - " + maxFloor}</Text>
        </View>
        <View style={styles.sliderFilters}>
          <MultiSlider
            markerStyle={styles.slider}
            selectedStyle={styles.slider}
            min={0}
            max={30}
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
      </ScrollView>
      <View style={styles.bigBtn}>
        <Button
          title={t("SEARCH_FORM.SHOW_RESULTS")}
          full
          onPress={() => showProperties()}
        ></Button>
      </View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: Colors.white,
    width: dpx(17),
    height: dpx(17),
    borderRadius: 100,
  },
  cityContainer: {
    marginVertical: dpx(10),
    width: dpx(170),
    borderRadius: dpx(10),
    borderWidth: 1,
    borderColor: Colors.lightGray,
    alignSelf: "center",
  },
});
