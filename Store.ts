import { action, computed, makeObservable, observable } from "mobx";
import { SearchFiltersI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  filters: SearchFiltersI = {};

  constructor() {
    makeObservable(this, {
      user: observable,
      filters: observable,
      isAnyFilterActive: computed,
      setUser: action,
      setFilters: action,
      resetFilters: action,
      setSorting: action,
    });
  }

  setUser(user: UserI | null) {
    this.user = user;
  }

  setFilters(filters: SearchFiltersI) {
    this.filters = filters;
  }

  resetFilters() {
    this.filters = {
      sortBy: "date",
      sortOrder: -1,
    };
  }

  get isAnyFilterActive() {
    if (
      Object.keys(this.filters).some(
        (key) =>
          (this.filters as any)[key] !== undefined &&
          key !== "sortOrder" &&
          key !== "sortBy"
      )
    ) {
      return true;
    }
    return false;
  }

  setSorting(sortBy: string, sortOrder: number) {
    this.filters = {
      ...this.filters,
      sortBy,
      sortOrder,
    };
  }
}

export const Store = new StoreImpl();
