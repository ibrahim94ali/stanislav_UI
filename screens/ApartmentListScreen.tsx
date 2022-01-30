import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import Colors from "../constants/Colors";
import { dpx } from "../constants/Spacings";
import ActiveFilterBadge from "../components/ActiveFilterBadge";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_APARTMENTS, GET_SEARCHED_APARTMENTS } from "../graphQL/Queries";
import { ApartmentI, SearchFiltersI } from "../interfaces";
import Property from "../components/Property";
import LoadingSpinner from "../components/LoadingSpinner";
import BottomSheet from "@gorhom/bottom-sheet";
import { SortTypeI, sortTypes } from "../constants/Selectable";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import NoResult from "../components/NoResult";
import { SafeAreaView } from "react-native-safe-area-context";
import { filtersVar, resetFilters, setSorting } from "../Store";

interface Props {
  navigation: any;
  route: any;
}

const DATA_LIMIT = 20;

const ApartmentListScreen = (props: Props) => {
  const filters = useReactiveVar(filtersVar);
  let filteredData: any, isDataLoading, fetchMoreData: any;

  const [q, setQ] = useState<string | undefined>(
    props.route?.params?.q || undefined
  );

  const [shouldFetchMore, setShouldFetchMore] = useState(true);

  if (q) {
    const { data, loading } = useQuery(GET_SEARCHED_APARTMENTS, {
      variables: {
        q: q,
      },
    });
    filteredData = data;
    isDataLoading = loading;
  } else {
    const { data, loading, fetchMore } = useQuery(GET_APARTMENTS, {
      variables: {
        ...filters,
        limit: DATA_LIMIT,
      },
    });
    filteredData = data;
    isDataLoading = loading;
    fetchMoreData = fetchMore;
  }

  const removeFilters = () => {
    setQ(undefined);
    resetFilters();
  };

  const { t } = useTranslation();

  const [isSortingActive, setIsSortingActive] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [dpx(300)], []);
  const handleSheetChanges = useCallback((index: number) => {
    setIsSortingActive(index === 1 ? true : false);
  }, []);

  const handleSortModal = (open?: boolean) => {
    if (open) {
      bottomSheetRef.current?.expand();
    } else if (open === false) {
      bottomSheetRef.current?.close();
    } else {
      //toggle
      if (isSortingActive) {
        bottomSheetRef.current?.close();
      } else {
        bottomSheetRef.current?.expand();
      }
    }
  };

  const handleSortFieldChange = (selectedField: SortTypeI) => {
    setSorting(selectedField.value, selectedField.order);
    setTimeout(() => {
      handleSortModal(false);
    }, 500);
  };

  const isAnyFilterActive = () => {
    if (
      Object.entries(filters).some(
        ([key, value]) =>
          key !== "sortOrder" && key !== "sortBy" && value !== undefined
      )
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (!filters.sortBy) {
      setSorting("createdAt", -1);
    }
  }, []);

  useEffect(() => {
    setShouldFetchMore(true);
  }, [filters]);

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {isDataLoading ? <LoadingSpinner /> : null}
      <Header>
        <IconButton handlePress={() => props.navigation.goBack()}>
          <Ionicons name="arrow-back" color={Colors.black} size={dpx(24)} />
        </IconButton>
        <Text style={styles.header}>{t("APARTMENT_LIST_SCREEN.RESULTS")}</Text>
        <IconButton handlePress={() => handleSortModal()}>
          <MaterialCommunityIcons
            name="sort-ascending"
            color={Colors.black}
            size={dpx(24)}
          />
        </IconButton>
      </Header>

      {(isAnyFilterActive() || q) && (
        <View style={styles.activeFiltersContainer}>
          <ActiveFilterBadge
            name={t("APARTMENT_LIST_SCREEN.ACTIVE_FILTERS")}
            onPress={() => removeFilters()}
          />
        </View>
      )}

      {filteredData &&
        !!q &&
        filteredData?.searchedApartments?.length === 0 && <NoResult />}

      {filteredData && !q && filteredData?.apartments?.length === 0 && (
        <NoResult />
      )}

      <ScrollView
        contentContainerStyle={{
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const scrollPosition = e.nativeEvent.contentOffset.y;
          const contentHeight = e.nativeEvent.contentSize.height;
          const isScrolledToBottom = contentHeight + scrollPosition;

          const resultsLength = filteredData.apartments.length;

          if (
            shouldFetchMore &&
            resultsLength >= DATA_LIMIT &&
            isScrolledToBottom >= contentHeight - 50
          ) {
            fetchMoreData({
              variables: {
                limit: resultsLength + DATA_LIMIT,
              },
            }).then((res: any) => {
              if (resultsLength === res.data.apartments.length) {
                setShouldFetchMore(false);
              }
            });
          }
        }}
      >
        {(filteredData &&
          !!q &&
          filteredData?.searchedApartments?.map((apart: ApartmentI) => (
            <View key={apart.id} style={styles.property}>
              <Property apartment={apart} />
            </View>
          ))) ||
          (!q &&
            filteredData?.apartments?.map((apart: ApartmentI) => (
              <View key={apart.id} style={styles.property}>
                <Property apartment={apart} />
              </View>
            )))}
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: Colors.bg }}
      >
        <View style={styles.sortContainer}>
          <Text style={styles.sortHeader}>
            {t("APARTMENT_LIST_SCREEN.SORT_BY") + ":"}
          </Text>
          <View style={styles.sortListContainer}>
            {sortTypes.map((sortType) => {
              const isSelected =
                filters?.sortBy === sortType.value &&
                filters?.sortOrder === sortType.order;
              return (
                <TouchableOpacity
                  style={styles.sortList}
                  key={sortType.label}
                  onPress={() => handleSortFieldChange(sortType)}
                >
                  <FontAwesome5
                    name={isSelected ? "check-circle" : "circle"}
                    size={24}
                    color={isSelected ? Colors.primary : Colors.black}
                  />
                  <Text
                    style={[
                      styles.sortListText,
                      { color: isSelected ? Colors.primary : Colors.black },
                    ]}
                  >
                    {t(`APARTMENT_LIST_SCREEN.SORTS.${sortType.label}`)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ApartmentListScreen;

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
  activeFiltersContainer: {
    marginBottom: dpx(10),
    justifyContent: "center",
    alignItems: "center",
  },
  property: {
    width: dpx(330),
    height: dpx(270),
    marginBottom: dpx(20),
  },
  sortContainer: {
    paddingHorizontal: dpx(20),
  },
  sortHeader: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(16),
    color: Colors.black,
  },
  sortListContainer: {
    marginVertical: dpx(10),
  },
  sortList: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: dpx(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  sortListText: {
    fontFamily: "Montserrat_500Medium",
    fontSize: dpx(14),
    marginLeft: dpx(10),
  },
});
