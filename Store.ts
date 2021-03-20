import { action, makeObservable, observable } from "mobx";
import { ApartmentI, UserI } from "./interfaces";

export class StoreImpl {
  user: UserI | null = null;
  apartments: ApartmentI[] = [];
  myApartments: ApartmentI[] = [];
  favApartments: ApartmentI[] = [];

  constructor() {
    makeObservable(this, {
      user: observable,
      apartments: observable,
      myApartments: observable,
      favApartments: observable,
      setUser: action,
      setApartments: action,
      setMyApartments: action,
      setFavoriteApartments: action,
      addApartment: action,
      deleteApartment: action,
    });
  }

  setUser(user: UserI | null) {
    this.user = user;
  }

  setApartments(aparts: ApartmentI[]) {
    this.apartments = aparts;
    const favs = aparts.filter((ap) => ap.isFavorite);
    this.setFavoriteApartments(favs);
  }

  setMyApartments(aparts: ApartmentI[]) {
    this.myApartments = aparts;
  }

  setFavoriteApartments(aparts: ApartmentI[]) {
    this.favApartments = aparts.map((ap) => ({ ...ap, isFavorite: true }));
    const favAptIds = this.favApartments.map((ap) => ap.id);
    this.apartments = this.apartments.map((ap) => ({
      ...ap,
      isFavorite: favAptIds.includes(ap.id),
    }));
  }

  addApartment(apart: ApartmentI) {
    this.apartments.unshift(apart);
    this.myApartments.unshift(apart);
  }

  deleteApartment(id: string) {
    this.apartments = this.apartments.filter((a) => a.id !== id);
    this.myApartments = this.myApartments.filter((a) => a.id !== id);
  }
}

export const Store = new StoreImpl();
