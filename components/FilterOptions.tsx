import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import FilterBadge from "./FilterBadge";

interface Props {
  title?: string;
  any?: boolean;
  items: {
    value: any;
    label: string;
  }[];
  value?: any;
  onValueChange: any;
}

const FilterOptions = (props: Props) => {
  const [activeFilter, setActiveFilter] = useState<any | undefined>(
    props.value
  );

  useEffect(() => {
    setActiveFilter(props.value);
  }, [props.value]);

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
            value={undefined}
            isActive={activeFilter === undefined ? true : false}
            onValueChange={() => setActiveFilter(undefined)}
          />
        )}
        {props.items.map((item) => (
          <FilterBadge
            key={item.label}
            label={item.label}
            value={item.value}
            canDeactivate={!props.any}
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
