import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import FilterBadge from "./FilterBadge";

interface Props {
  title?: string;
  any?: boolean;
  items: {
    value: string;
    label: string;
  }[];
  onValueChange: any;
}

const FilterOptions = (props: Props) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    props.onValueChange(activeFilter);
  }, [activeFilter]);
  return (
    <View>
      {props.title && <Text style={styles.header}>{props.title}</Text>}
      <ScrollView
        style={styles.filterContainer}
        contentContainerStyle={{
          paddingRight: dpx(20),
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {props.any && (
          <FilterBadge
            label="Any"
            value={null}
            isActive={activeFilter ? false : true}
            onValueChange={() => setActiveFilter(null)}
          />
        )}
        {props.items.map((item) => (
          <FilterBadge
            key={item.label}
            label={item.label}
            value={item.value}
            isActive={activeFilter === item.value}
            onValueChange={(val: string) => setActiveFilter(val)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterOptions;

const styles = StyleSheet.create({
  header: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    color: Colors.black,
    marginLeft: dpx(20),
  },
  filterContainer: {
    marginTop: dpx(10),
    paddingLeft: dpx(10),
  },
});
