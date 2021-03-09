import { action, makeObservable, observable } from "mobx";
import { ApartmentI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  apartments: ApartmentI[] = [];
  myApartments: ApartmentI[] = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      apartments: observable,
      myApartments: observable,
      setUser: action,
      setApartments: action,
      addApartment: action,
      setMyApartments: action,
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
    this.myApartments.unshift(apart);
  }

  setMyApartments(aparts: ApartmentI[]) {
    this.myApartments = aparts;
  }
}

export const Store = new StoreImpl();
