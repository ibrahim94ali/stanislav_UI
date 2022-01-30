import { BuildingType, AdType, HeatingType, AmenityType } from "../interfaces";

export const sortFields = [
  { value: "date", label: "Date" },
  { value: "price", label: "Price" },
  { value: "msquare", label: "Area" },
  { value: "roomCount", label: "Rooms" },
];

export const buildingTypes = [
  { value: BuildingType.FLAT },
  { value: BuildingType.HOUSE },
  { value: BuildingType.VILLA },
  { value: BuildingType.SHOP },
  { value: BuildingType.LAND },
];

export const adTypes = [{ value: AdType.RENT }, { value: AdType.PURCHASE }];
export const heatingTypes = [
  { value: HeatingType.NONE },
  { value: HeatingType.ELECTRIC },
  { value: HeatingType.WOOD },
  { value: HeatingType.PALETTE },
  { value: HeatingType.CENTRAL },
  { value: HeatingType.COAL },
  { value: HeatingType.GAS },
  { value: HeatingType.OTHER },
];

export const amenityTypes = [
  { value: AmenityType.BALCONY },
  { value: AmenityType.PARKING },
  { value: AmenityType.LIFT },
  { value: AmenityType.GARDEN },
  { value: AmenityType.PET_FRIENDLY },
  { value: AmenityType.GOOD_ISOLATION },
  { value: AmenityType.POOL },
  { value: AmenityType.FIREPLACE },
  { value: AmenityType.DUBLEX },
];

export const furnishingTypes = [
  { value: true, label: "Furnished" },
  { value: false, label: "Unfurnished" },
];

export const wheelChairAccessibleTypes = [
  { value: true, label: "WheelChairAccessible" },
  { value: false, label: "NotWheelChairAccessible" },
];

export const profileTypes = [
  { value: "person", label: "person" },
  { value: "agency", label: "agency" },
];

export interface SortTypeI {
  label: string;
  value: string;
  order: number;
}

export const sortTypes: SortTypeI[] = [
  {
    label: "Newest",
    value: "createdAt",
    order: -1,
  },
  {
    label: "Price_LH",
    value: "price",
    order: 1,
  },
  {
    label: "Price_HL",
    value: "price",
    order: -1,
  },
  {
    label: "Area_LH",
    value: "msquare",
    order: 1,
  },
  {
    label: "Area_HL",
    value: "msquare",
    order: -1,
  },
];

export const filterLimits = {
  maxAge: 50,
  maxArea: 500,
  maxRoom: 20,
  maxFloor: 50,
  maxPrice: {
    rent: 2000,
    purchase: 1000000,
  },
};
