import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import { AdType, BuildingType, CityType, SearchFiltersI } from "../interfaces";
import { ScrollView } from "react-native-gesture-handler";
import {
  sortFields,
  adTypes,
  buildingTypes,
  cityTypes,
} from "../constants/Selectable";
import Header from "./Header";
import IconButton from "./IconButton";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Button from "./Button";
import FilterOptions from "./FilterOptions";

const CustomSliderMarker = () => {
  return (
    <View style={styles.customSliderMarkerContainer}>
      <View style={styles.customSliderMarkerInside}></View>
    </View>
  );
};

const SearchForm = ({ closeFilters, goToProperties }: any) => {
  const store = useStore();

  const { width: viewportWidth } = Dimensions.get("window");

  const [selectedOrder, setSelectedOrder] = useState(-1);

  const [selectedSort, setSelectedSort] = useState(sortFields[0]?.value);
  const [selectedCity, setSelectedCity] = useState<CityType>();
  const [selectedBuildingType, setSelectedBuildingType] =
    useState<BuildingType>();
  const [selectedAdType, setSelectedAdType] = useState<AdType>();

  //price
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);

  //area
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(300);

  // room
  const [minRoom, setMinRoom] = useState(0);
  const [maxRoom, setMaxRoom] = useState(10);

  // floor
  const [minFloor, setMinFloor] = useState(0);
  const [maxFloor, setMaxFloor] = useState(30);

  useEffect(() => {
    if (selectedAdType === AdType.RENT) {
      setMaxPrice(1000);
    } else {
      setMaxPrice(1000000);
    }
  }, [selectedAdType]);

  const showProperties = () => {
    const newFilters: SearchFiltersI = {
      sortBy: selectedSort,
      city: selectedCity,
      buildingType: selectedBuildingType,
      adType: selectedAdType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minRoom,
      maxRoom,
      minFloor,
      maxFloor,
      sortOrder: selectedOrder,
    };
    store.setFilters(newFilters);
    goToProperties();
  };

  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: dpx(50),
        }}
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <IconButton handlePress={() => null}>
            <MaterialCommunityIcons name="restart" size={24} color="black" />
          </IconButton>
          <Text style={styles.header}>Filters</Text>
          <IconButton handlePress={() => closeFilters()}>
            <Ionicons name="close" color={Colors.black} size={dpx(24)} />
          </IconButton>
        </Header>

        <View style={styles.filterContainer}>
          <FilterOptions
            title="City"
            any
            items={cityTypes}
            onValueChange={(itemValue: CityType) => {
              setSelectedCity(itemValue);
            }}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterOptions
            title="Property Type"
            any
            items={buildingTypes}
            onValueChange={(itemValue: BuildingType) => {
              setSelectedBuildingType(itemValue);
            }}
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterOptions
            title="Ad Type"
            any
            items={adTypes}
            onValueChange={(itemValue: AdType) => {
              setSelectedAdType(itemValue);
            }}
          />
        </View>

        {/* price */}
        <View style={styles.sliderTextContainer}>
          <Text style={styles.sliderHeader}>Price</Text>
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
          <Text style={styles.sliderHeader}>Area</Text>
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
          <Text style={styles.sliderHeader}>Rooms</Text>
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
          <Text style={styles.sliderHeader}>Floor</Text>
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
          title="Show Properties"
          full
          onPress={() => showProperties()}
        ></Button>
      </View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
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
});
