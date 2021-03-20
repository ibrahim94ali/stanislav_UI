import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useQuery } from "@apollo/client";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";
import Colors from "../constants/Colors";
import LoadingSpinner from "./LoadingSpinner";
import { observer } from "mobx-react";
import RNPickerSelect from "react-native-picker-select";
import { dpx } from "../constants/Spacings";

const SearchForm = ({ open }: { open: boolean }) => {
  const store = useStore();

  const sortFields = [
    { value: "date", label: "Date" },
    { value: "price", label: "Price" },
    { value: "msquare", label: "Area" },
    { value: "roomCount", label: "Rooms" },
  ];
  const filterCities = [
    { value: "All", label: "All" },
    { value: "Skopje", label: "Skopje" },
    { value: "Gostivar", label: "Gostivar" },
  ];

  const [selectedOrder, setSelectedOrder] = useState(-1);

  const [selectedSort, setSelectedSort] = useState(sortFields[0]?.value);
  const [selectedCity, setSelectedCity] = useState("All");

  //price
  const [minPrice, setMinPrice] = useState(0);
  const [minPriceText, setMinPriceText] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxPriceText, setMaxPriceText] = useState(1000);

  //area
  const [minArea, setMinArea] = useState(0);
  const [minAreaText, setMinAreaText] = useState(0);
  const [maxArea, setMaxArea] = useState(300);
  const [maxAreaText, setMaxAreaText] = useState(300);

  // room
  const [minRoom, setMinRoom] = useState(0);
  const [minRoomText, setMinRoomText] = useState(0);
  const [maxRoom, setMaxRoom] = useState(10);
  const [maxRoomText, setMaxRoomText] = useState(10);

  const { data, loading: isDataLoading } = useQuery(GET_APARTMENTS, {
    variables: {
      sortBy: selectedSort,
      city: selectedCity === "All" ? null : selectedCity,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      minRoom,
      maxRoom,
      sortOrder: selectedOrder,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (data) {
      store.setApartments(data.apartments);
    }
  }, [data]);

  return (
    <View>
      {isDataLoading ? <LoadingSpinner /> : null}
      <View style={open ? styles.container : styles.hide}>
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
            />
          </View>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Cities: </Text>
          <View style={styles.picker}>
            <RNPickerSelect
              placeholder={{}}
              value={selectedCity}
              onValueChange={(itemValue) => {
                setSelectedCity(itemValue);
              }}
              itemKey="value"
              items={filterCities}
            />
          </View>
          {/* <Picker
            selectedValue={selectedCity}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCity(itemValue.toString())}
          >
            {filterCities.map((item, index) => (
              <Picker.Item label={item} value={item} key={index} />
            ))}
          </Picker> */}
        </View>

        {/* price */}
        <View style={styles.item}>
          <Text style={styles.itemText}>Price (€): </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.minSlider}>{minPriceText}</Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              min={0}
              max={1000}
              step={50}
              sliderLength={dpx(170)}
              values={[minPrice, maxPrice]}
              onValuesChange={([min, max]) => {
                setMinPriceText(min);
                setMaxPriceText(max);
              }}
              onValuesChangeFinish={([min, max]) => {
                setMinPrice(min);
                setMaxPrice(max);
              }}
            />
            <Text style={styles.maxSlider}>{maxPriceText}</Text>
          </View>
        </View>

        {/* area */}
        <View style={styles.item}>
          <Text style={styles.itemText}>Area (ms2): </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.minSlider}>{minAreaText}</Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              min={0}
              max={300}
              step={10}
              sliderLength={dpx(170)}
              values={[minArea, maxArea]}
              onValuesChange={([min, max]) => {
                setMinAreaText(min);
                setMaxAreaText(max);
              }}
              onValuesChangeFinish={([min, max]) => {
                setMinArea(min);
                setMaxArea(max);
              }}
            />
            <Text style={styles.maxSlider}>{maxAreaText}</Text>
          </View>
        </View>

        {/* room */}
        <View style={styles.item}>
          <Text style={styles.itemText}>Rooms: </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.minSlider}>{minRoomText}</Text>
            <MultiSlider
              markerStyle={styles.slider}
              selectedStyle={styles.slider}
              isMarkersSeparated
              min={0}
              max={10}
              step={1}
              sliderLength={dpx(170)}
              values={[minRoom, maxRoom]}
              onValuesChange={([min, max]) => {
                setMinRoomText(min);
                setMaxRoomText(max);
              }}
              onValuesChangeFinish={([min, max]) => {
                setMinRoom(min);
                setMaxRoom(max);
              }}
            />
            <Text style={styles.maxSlider}>{maxRoomText}</Text>
          </View>
        </View>
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
  slider: {
    backgroundColor: Colors.secondary,
  },
  minSlider: {
    marginRight: 10,
    width: 30,
  },
  maxSlider: {
    marginLeft: 30,
  },
});
