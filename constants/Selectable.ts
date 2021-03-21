import { BuildingType, AdType, CityType } from "../interfaces";

export const sortFields = [
  { value: "date", label: "Date" },
  { value: "price", label: "Price" },
  { value: "msquare", label: "Area" },
  { value: "roomCount", label: "Rooms" },
];

export const buildingTypes = [
  { value: BuildingType.FLAT, label: "Flat" },
  { value: BuildingType.HOUSE, label: "House" },
];

export const adTypes = [
  { value: AdType.RENT, label: "Rent" },
  { value: AdType.PURCHASE, label: "Purchase" },
];

export const cityTypes = [
  { value: CityType.BITOLA, label: "Bitola" },
  { value: CityType.GOSTIVAR, label: "Gostivar" },
  { value: CityType.OHRID, label: "Ohrid" },
  { value: CityType.SKOPJE, label: "Skopje" },
  { value: CityType.TETOVO, label: "Tetovo" },
];
