import { SearchFiltersI, UserI } from "./interfaces";
import { ReactiveVar, makeVar } from "@apollo/client";

export const filtersVar: ReactiveVar<SearchFiltersI> = makeVar<SearchFiltersI>(
  {}
);

export const userVar: ReactiveVar<UserI | null> = makeVar<UserI | null>(null);

export const setUser = (user: UserI | null) => {
  userVar(user);
};

export const setFilters = (filters: SearchFiltersI) => {
  filtersVar(filters);
};

export const resetFilters = () => {
  filtersVar({
    sortBy: "date",
    sortOrder: -1,
  });
};

export const setSorting = (sortBy: string, sortOrder: number) => {
  filtersVar({
    ...filtersVar(),
    sortBy,
    sortOrder,
  });
};
