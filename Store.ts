import { action, makeObservable, observable } from "mobx";
import { SearchFiltersI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  filters: SearchFiltersI = {};

  constructor() {
    makeObservable(this, {
      user: observable,
      filters: observable,
      setUser: action,
      setFilters: action,
    });
  }

  setUser(user: UserI | null) {
    this.user = user;
  }

  setFilters(filters: SearchFiltersI) {
    this.filters = filters;
  }
}

export const Store = new StoreImpl();
