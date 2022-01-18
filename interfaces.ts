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
  heatingType: HeatingType;
  amenities: AmenityType[];
  photos: string[];
  msquare: number;
  roomCount: number;
  ownerId: string;
  floor: number;
  age: number;
  owner?: UserI;
  isFavorite?: boolean;
  isFurnished: boolean;
  isFeatured?: boolean;
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

export interface SearchFiltersI {
  city?: CityType;
  buildingType?: BuildingType;
  adType?: AdType;
  heatingType?: HeatingType;
  amenities?: AmenityType[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minRoom?: number;
  maxRoom?: number;
  minFloor?: number;
  maxFloor?: number;
  age?: number;
  isFeatured?: boolean;
  isFurnished?: boolean;
  sortBy?: string;
  sortOrder?: number;
}

export enum BuildingType {
  HOUSE = "house",
  FLAT = "flat",
  VILLA = "villa",
  SHOP = "shop",
  LAND = "land",
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
  STRUGA = "struga",
  VELES = "veles",
  PRILEP = "prilep",
  DEBAR = "debar",
  KICEVO = "kicevo",
  STRUMICA = "strumica",
  KUMANOVO = "kumanovo",
}

export enum HeatingType {
  WOOD = "wood",
  CENTRAL = "central",
  ELECTRIC = "electric",
  PALETTE = "palette",
  COAL = "coal",
  GAS = "gas",
}

export enum AmenityType {
  POOL = "pool",
  PARKING = "parking",
  GARDEN = "garden",
  FIREPLACE = "fireplace",
  GOOD_ISOLATION = "good-isolation",
}
