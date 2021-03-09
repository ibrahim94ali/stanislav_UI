import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useQuery } from "@apollo/client";
import { GET_APARTMENTS } from "../graphQL/Queries";
import { useStore } from "../hooks/StoreContext";

const SearchForm = ({ open }: { open: boolean }) => {
  const store = useStore();

  const [selectedOrder, setSelectedOrder] = useState(-1);

  const [selectedSort, setSelectedSort] = useState("date");
  const [selectedCity, setSelectedCity] = useState("All");

  const [minPrice, setMinPrice] = useState(0);
  const [minPriceText, setMinPriceText] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [maxPriceText, setMaxPriceText] = useState(1000);

  const sortFields = ["Date", "Price", "Msquare", "RoomCount"];
  const filterCities = ["All", "Skopje", "Gostivar"];

  const { data } = useQuery(GET_APARTMENTS, {
    variables: {
      sortBy: selectedSort?.toLowerCase(),
      city: selectedCity === "All" ? null : selectedCity,
      minPrice,
      maxPrice,
      sortOrder: selectedOrder,
    },
  });

  useEffect(() => {
    if (data) {
      store.setApartments(data.apartments);
    }
  }, [data]);

  return (
    <View style={open ? styles.container : styles.hide}>
      <View style={styles.item}>
        <Text style={styles.itemText}>Sort Order: </Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedOrder}
          onValueChange={(itemValue) => {
            setSelectedOrder(+itemValue);
          }}
        >
          <Picker.Item label={"High to Low"} value={-1} />
          <Picker.Item label={"Low to High"} value={1} />
        </Picker>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>Sort By: </Text>
        <Picker
          style={styles.picker}
          selectedValue={selectedSort}
          onValueChange={(itemValue) => {
            setSelectedSort(itemValue.toString());
          }}
        >
          {sortFields.map((item, index) => (
            <Picker.Item label={item} value={item} key={index} />
          ))}
        </Picker>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>Cities: </Text>
        <Picker
          selectedValue={selectedCity}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCity(itemValue.toString())}
        >
          {filterCities.map((item, index) => (
            <Picker.Item label={item} value={item} key={index} />
          ))}
        </Picker>
      </View>
      <View style={styles.item}>
        <Text style={styles.itemText}>Price: </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.minPrice}>{minPriceText}</Text>
          <MultiSlider
            isMarkersSeparated={true}
            min={0}
            max={1000}
            step={50}
            sliderLength={180}
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
          <Text style={styles.maxPrice}>{maxPriceText}</Text>
        </View>
      </View>
    </View>
  );
};

export default SearchForm;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  hide: {
    display: "none",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 50,
  },
  itemText: {
    flex: 1,
  },
  picker: {
    flex: 1,
  },
  sliderContainer: {
    width: "70%",
    flexDirection: "row",
    alignItems: "center",
  },
  slider: {
    // width: "70%",
  },
  minPrice: {
    marginRight: 10,
    width: 30,
  },
  maxPrice: {
    marginLeft: 10,
  },
});
