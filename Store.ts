import { action, makeObservable, observable } from "mobx";
import { ApartmentI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  apartments: ApartmentI[] = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      apartments: observable,
      setUser: action,
      setApartments: action,
      addApartment: action,
    });
  }

  setUser(user: UserI | null) {
    this.user = user;
  }

  setApartments(aparts: ApartmentI[]) {
    this.apartments = aparts;
  }

  addApartment(apart: ApartmentI) {
    this.apartments.unshift(apart);
  }
}

export const Store = new StoreImpl();
