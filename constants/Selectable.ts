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
  { value: BuildingType.VILLA, label: "Villa" },
  { value: BuildingType.SHOP, label: "Shop" },
  { value: BuildingType.LAND, label: "Land" },
];

export const adTypes = [
  { value: AdType.RENT, label: "Rent" },
  { value: AdType.PURCHASE, label: "Purchase" },
];

export const furnishingTypes = [
  { value: true, label: "Furnished" },
  { value: false, label: "Unfurnished" },
];

export const cityTypes = [
  {
    value: CityType.BITOLA,
    label: "Bitola",
    url: "https://static.trip101.com/main_pics/218282/medium.jpg",
  },
  {
    value: CityType.GOSTIVAR,
    label: "Gostivar",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Gostivarcenter.jpg",
  },
  {
    value: CityType.OHRID,
    label: "Ohrid",
    url: "https://media.istockphoto.com/photos/sveti-jovan-kaneo-church-on-lake-ohrid-macedonia-picture-id497144333?k=20&m=497144333&s=612x612&w=0&h=jrxn7RTJoOu9e-wUMSazAlzqP-FYzgdxxWTdVj8Jicg=",
  },
  {
    value: CityType.SKOPJE,
    label: "Skopje",
    url: "https://media.istockphoto.com/photos/alexander-statue-in-skopje-center-picture-id564585966?k=20&m=564585966&s=612x612&w=0&h=SulNwXYQCSgkY1hhVF1DPUqrSxWE0QkT_eKkXGPzaNM=",
  },
  {
    value: CityType.TETOVO,
    label: "Tetovo",
    url: "https://i0.wp.com/www.travelsewhere.net/wp-content/uploads/2016/11/DSC_0178-4.jpg?fit=585%2C390&ssl=1",
  },
];

export interface SortTypeI {
  label: string;
  value: string;
  order: number;
}

export const sortTypes: SortTypeI[] = [
  {
    label: "Newest",
    value: "date",
    order: -1,
  },
  {
    label: "Price (low to high)",
    value: "price",
    order: 1,
  },
  {
    label: "Price (high to low)",
    value: "price",
    order: -1,
  },
  {
    label: "Area (low to high)",
    value: "msquare",
    order: 1,
  },
  {
    label: "Area (high to low)",
    value: "msquare",
    order: -1,
  },
];

export const sponsors = [
  {
    name: "Antep Baklava",
    redirectUrl: "https://www.antepbaklava.mk",
    logoUrl: "https://www.antepbaklava.mk/antep-icon.png",
  },
  {
    name: "Red Bull",
    redirectUrl: "https://www.redbull.com",
    logoUrl:
      "https://i.pinimg.com/originals/ec/d1/bf/ecd1bf4aa8781e0e4761106cebffce16.jpg",
  },
  {
    name: "Mercedes",
    redirectUrl: "https://www.mercedes-benz.com/en/",
    logoUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpvyBYPm4HHpTf4hiXUtrE-lcuAhFUjtaTVA&usqp=CAU",
  },
  {
    name: "Ferrari",
    redirectUrl: "https://www.ferrari.com/en-EN",
    logoUrl:
      "https://prod.cloud.rockstargames.com/crews/sc/2620/9252858/publish/emblem/emblem_512.png",
  },
];

//TODO:
// - Furnishing
// - Heating
// - Amenities
