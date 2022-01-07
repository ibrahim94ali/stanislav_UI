import { action, makeObservable, observable } from "mobx";
import { SearchFiltersI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  filters: SearchFiltersI = {};
  isAnyFilterActive: boolean = false;

  constructor() {
    makeObservable(this, {
      user: observable,
      filters: observable,
      isAnyFilterActive: observable,
      setUser: action,
      setFilters: action,
      resetFilters: action,
    });
  }

  setUser(user: UserI | null) {
    this.user = user;
  }

  setFilters(filters: SearchFiltersI) {
    this.filters = filters;
    if (Object.values(filters).some((value) => value)) {
      this.isAnyFilterActive = true;
    }
  }

  resetFilters() {
    this.filters = {};
    this.isAnyFilterActive = false;
  }
}

export const Store = new StoreImpl();
