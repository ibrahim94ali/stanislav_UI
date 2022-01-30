import { SearchFiltersI, UserI } from "./interfaces";
import { ReactiveVar, makeVar } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const filtersVar: ReactiveVar<SearchFiltersI> = makeVar<SearchFiltersI>(
  {}
);

export const userVar: ReactiveVar<UserI | null> = makeVar<UserI | null>(null);

export const setUser = async (user: UserI | null) => {
  userVar(user);
  if (user) {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem("user");
  }
};

export const setFilters = async (filters: SearchFiltersI) => {
  filtersVar(filters);
  await AsyncStorage.setItem("filters", JSON.stringify(filters));
};

export const resetFilters = async () => {
  const newFilters: SearchFiltersI = {
    sortBy: "createdAt",
    sortOrder: -1,
  };
  filtersVar(newFilters);
  await AsyncStorage.setItem("filters", JSON.stringify(newFilters));
};

export const setSorting = async (sortBy: string, sortOrder: number) => {
  filtersVar({
    ...filtersVar(),
    sortBy,
    sortOrder,
  });
  await AsyncStorage.setItem(
    "filters",
    JSON.stringify({
      ...filtersVar(),
      sortBy,
      sortOrder,
    })
  );
};
