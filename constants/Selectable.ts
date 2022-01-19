import {
  BuildingType,
  AdType,
  CityType,
  HeatingType,
  AmenityType,
} from "../interfaces";

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
  { value: AmenityType.POOL },
  { value: AmenityType.PARKING },
  { value: AmenityType.FIREPLACE },
  { value: AmenityType.GARDEN },
  { value: AmenityType.GOOD_ISOLATION },
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
  {
    value: CityType.STRUGA,
    label: "Struga",
    url: "https://poetryrun.mk/storage/600238be187c9.jpg",
  },
  {
    value: CityType.VELES,
    label: "Veles",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Veles_X17.jpg/1920px-Veles_X17.jpg",
  },
  {
    value: CityType.PRILEP,
    label: "Prilep",
    url: "https://100daysandnights.com/wp-content/uploads/2020/03/Vito-Valentinetti-Prilep-2020-45.jpg",
  },
  {
    value: CityType.DEBAR,
    label: "Debar",
    url: "https://macedonia-timeless.com/wp-content/uploads/2018/08/debar.jpg",
  },
  {
    value: CityType.KICEVO,
    label: "Kicevo",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komuna-e-kercoves.png",
  },
  {
    value: CityType.STRUMICA,
    label: "Strumica",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c1/%D0%9F%D0%BB%D0%BE%D1%88%D1%82%D0%B0%D0%B4_%D0%93%D0%BE%D1%86%D0%B5_%D0%94%D0%B5%D0%BB%D1%87%D0%B5%D0%B2_%D0%A1%D1%82%D1%80%D1%83%D0%BC%D0%B8%D1%86%D0%B0_%282%29.jpg",
  },
  {
    value: CityType.KUMANOVO,
    label: "Kumanovo",
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_square_of_Kumanovo_%282%29.JPG/1920px-The_square_of_Kumanovo_%282%29.JPG",
  },
].sort((a, b) => (a.label > b.label ? 1 : -1));

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
