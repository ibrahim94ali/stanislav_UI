export interface ApartmentI {
  id: string;
  title: string;
  details: string;
  date: string;
  geolocation: number[];
  address: string;
  city: string;
  price: number;
  buildingType: BuildingType;
  adType: AdType;
  photos: string[];
  msquare: number;
  roomCount: number;
  ownerId: string;
  floor: number;
  owner?: UserI;
  isFavorite?: boolean;
}

export interface UserI {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  token?: string;
  verified?: boolean;
  roles?: string[];
}

export enum BuildingType {
  HOUSE = "house",
  FLAT = "flat",
}

export enum AdType {
  RENT = "rent",
  PURCHASE = "purchase",
}

export enum CityType {
  SKOPJE = "skopje",
  GOSTIVAR = "gostivar",
  TETOVO = "tetovo",
  OHRID = "ohrid",
  BITOLA = "bitola",
}
