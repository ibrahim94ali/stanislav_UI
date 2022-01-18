import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import FilterBadge from "./FilterBadge";

interface Props {
  title?: string;
  any?: boolean;
  multiple?: boolean;
  items: {
    value: any;
    label?: string;
  }[];
  value?: any;
  onValueChange: any;
}

const FilterOptions = (props: Props) => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<any | undefined>(
    props.value
  );

  const updateValue = (value: any) => {
    if (!props.multiple) {
      setActiveFilter(value);
      return;
    }

    switch (value) {
      case undefined:
        setActiveFilter([]);
        break;
      default:
        if (!activeFilter.includes(value)) {
          setActiveFilter([...activeFilter, value]);
        } else {
          setActiveFilter(
            activeFilter.filter((activeFilters: any) => activeFilters !== value)
          );
        }
        break;
    }
  };

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
            label={t("FILTER_OPTIONS.ANY")}
            value={undefined}
            isActive={
              (!props.multiple && activeFilter === undefined) ||
              (props.multiple && activeFilter?.length === 0)
                ? true
                : false
            }
            onValueChange={() => updateValue(undefined)}
          />
        )}
        {props.items.map((item) => (
          <FilterBadge
            key={item.value}
            label={
              item.label
                ? t(`FILTER_OPTIONS.${item.label}`)
                : t(`FILTER_OPTIONS.${item.value}`)
            }
            value={item.value}
            isActive={
              (!props.multiple && activeFilter === item.value) ||
              (props.multiple && activeFilter.includes(item.value))
            }
            onValueChange={(val: any) => updateValue(val)}
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
