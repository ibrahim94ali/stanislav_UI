import { action, makeObservable, observable } from "mobx";
import { ApartmentI, UserI } from "./interfaces";

export class StoreImpl {
    user: UserI | null = null;
    apartments: ApartmentI[] = [];

    constructor() {
        makeObservable(this, {
            user: observable,
            setUser: action,
            setApartments: action
        });
    }

    setUser(user: UserI | null) {
        this.user = user;
    }

    setApartments(aparts: ApartmentI[]) {
        this.apartments = aparts;
    }
}

export const Store = new StoreImpl();