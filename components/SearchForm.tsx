import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useQuery } from "@apollo/client";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";
import LoadingSpinner from "./LoadingSpinner";
import { observer } from "mobx-react";
import RNPickerSelect from "react-native-picker-select";
import { dpx } from "../constants/Spacings";
import { AdType, BuildingType, CityType } from "../interfaces";
import { ScrollView } from "react-native-gesture-handler";
import {
  sortFields,
  adTypes,
  buildingTypes,
  cityTypes,
} from "../constants/Selectable";

const SearchForm = ({ open }: { open: boolean }) => {
  const store = useStore();

  const placeholder = {
    label: "All",
    color: Colors.gray,
    value: null,
  };

  const { width: viewportWidth } = Dimensions.get("window");

  const [selectedOrder, setSelectedOrder] = useState(-1);

  const [selectedSort, setSelectedSort] = useState(sortFields[0]?.value);
  const [selectedCity, setSelectedCity] = useState<CityType>();
  const [
    selectedBuildingType,
    setSelectedBuildingType,
  ] = useState<BuildingType>();
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

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: {
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
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data) {
      store.setApartments(data.apartments);
    }
  }, [data]);

  useEffect(() => {
    if (selectedAdType === AdType.RENT) {
      setMaxPrice(1000);
    }

    if (selectedAdType === AdType.PURCHASE) {
      setMaxPrice(1000000);
    }
  }, [selectedAdType]);

  return (
    <View>
      {isDataLoading ? <LoadingSpinner /> : null}
      <View style={open ? styles.container : styles.hide}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* adtype */}
          <View style={styles.item}>
            <Text style={styles.itemText}>Ad Type: </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={placeholder}
                value={selectedAdType}
                onValueChange={(itemValue) => {
                  setSelectedAdType(itemValue);
                }}
                itemKey="value"
                items={adTypes}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* building type */}
          <View style={styles.item}>
            <Text style={styles.itemText}>Building Type: </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={placeholder}
                value={selectedBuildingType}
                onValueChange={(itemValue) => {
                  setSelectedBuildingType(itemValue);
                }}
                itemKey="value"
                items={buildingTypes}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          <View style={styles.item}>
            <Text style={styles.itemText}>Sort Order: </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={{}}
                value={selectedOrder}
                onValueChange={(itemValue) => {
                  setSelectedOrder(+itemValue);
                }}
                itemKey="value"
                items={[
                  { label: "High to Low", value: -1 },
                  { label: "Low to High", value: 1 },
                ]}
                style={pickerSelectStyles}
              />
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Sort By: </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={{}}
                value={selectedSort}
                onValueChange={(itemValue) => {
                  setSelectedSort(itemValue);
                }}
                itemKey="value"
                items={sortFields}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* Cities */}
          <View style={styles.item}>
            <Text style={styles.itemText}>Cities: </Text>
            <View style={styles.picker}>
              <RNPickerSelect
                placeholder={placeholder}
                value={selectedCity}
                onValueChange={(itemValue) => {
                  setSelectedCity(itemValue);
                }}
                itemKey="value"
                items={cityTypes}
                style={pickerSelectStyles}
              />
            </View>
          </View>

          {/* price */}
          <View style={styles.sliderFilters}>
            <Text style={styles.itemText}>Price (€): </Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              enableLabel
              min={0}
              max={selectedAdType === AdType.RENT ? 1000 : 1000000}
              step={selectedAdType === AdType.RENT ? 50 : 50000}
              sliderLength={viewportWidth * 0.7}
              values={[minPrice, maxPrice]}
              onValuesChangeFinish={([min, max]) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
            />
          </View>

          {/* area */}
          <View style={styles.sliderFilters}>
            <Text style={styles.itemText}>Area (ms2): </Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              enableLabel
              min={0}
              max={300}
              step={20}
              sliderLength={viewportWidth * 0.7}
              values={[minArea, maxArea]}
              onValuesChangeFinish={([min, max]) => {
                setMinArea(min);
                setMaxArea(max);
              }}
            />
          </View>

          {/* room */}
          <View style={styles.sliderFilters}>
            <Text style={styles.itemText}>Rooms: </Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              enableLabel
              min={0}
              max={10}
              step={1}
              sliderLength={viewportWidth * 0.7}
              values={[minRoom, maxRoom]}
              onValuesChangeFinish={([min, max]) => {
                setMinRoom(min);
                setMaxRoom(max);
              }}
            />
          </View>

          {/* floor */}
          <View style={styles.sliderFilters}>
            <Text style={styles.itemText}>Floor: </Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              enableLabel
              min={0}
              max={30}
              step={1}
              sliderLength={viewportWidth * 0.7}
              values={[minFloor, maxFloor]}
              onValuesChangeFinish={([min, max]) => {
                setMinFloor(min);
                setMaxFloor(max);
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default observer(SearchForm);

const styles = StyleSheet.create({
  container: {
    padding: dpx(10),
  },
  hide: {
    display: "none",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: dpx(10),
    paddingHorizontal: dpx(5),
  },
  itemText: {
    flex: 1,
  },
  picker: {
    flex: 1,
    color: Colors.black,
  },
  sliderContainer: {
    width: "75%",
    flexDirection: "row",
    alignItems: "center",
  },
  sliderFilters: {
    alignItems: "center",
  },
  slider: {
    backgroundColor: Colors.secondary,
  },
  minSlider: {
    marginRight: 10,
    width: 70,
  },
  maxSlider: {
    marginLeft: 30,
    width: 70,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
