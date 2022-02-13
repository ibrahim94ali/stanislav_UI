export interface ApartmentI {
  id: string;
  title: string;
  details: string;
  createdAt: Date;
  modifiedAt: Date;
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
  isWheelChairAccessible: boolean;
}

export interface UserI {
  id: string;
  email: string;
  name: string;
  phoneNumber: {
    countryCode: string;
    countryCodeName: string;
    shortPhoneNumber: string;
  };
  verified: boolean;
  type: string;
  token?: string;
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
  isWheelChairAccessible?: boolean;
}

export interface CityI {
  value: CityType;
  label: string;
  url: string;
}

export interface SponsorI {
  name: string;
  logoUrl: string;
  redirectUrl: string;
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
  NONE = "none",
  WOOD = "wood",
  CENTRAL = "central",
  ELECTRIC = "electric",
  PALETTE = "palette",
  COAL = "coal",
  GAS = "gas",
  OTHER = "other",
}

export enum AmenityType {
  POOL = "pool",
  PARKING = "parking",
  GARDEN = "garden",
  FIREPLACE = "fireplace",
  GOOD_ISOLATION = "good-isolation",
  LIFT = "lift",
  DUBLEX = "dublex",
  BALCONY = "balcony",
  PET_FRIENDLY = "pet-friendly",
}
