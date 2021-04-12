import { gql } from "@apollo/client";

export const GET_APARTMENTS = gql`
  query apartments(
    $city: String
    $buildingType: String
    $adType: String
    $minPrice: Int
    $maxPrice: Int
    $minArea: Int
    $maxArea: Int
    $minRoom: Int
    $maxRoom: Int
    $minFloor: Int
    $maxFloor: Int
    $sortBy: String
    $sortOrder: Int
  ) {
    apartments(
      city: $city
      buildingType: $buildingType
      adType: $adType
      minPrice: $minPrice
      maxPrice: $maxPrice
      minArea: $minArea
      maxArea: $maxArea
      minRoom: $minRoom
      maxRoom: $maxRoom
      minFloor: $minFloor
      maxFloor: $maxFloor
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      id
      title
      details
      owner {
        name
        surname
        email
        phone
      }
      date
      geolocation
      address
      city
      price
      buildingType
      adType
      photos
      msquare
      roomCount
      floor
      isFavorite
    }
  }
`;

export const GET_MY_APARTMENTS = gql`
  query {
    myApartments {
      id
      title
      details
      date
      geolocation
      address
      city
      price
      buildingType
      adType
      photos
      msquare
      roomCount
      floor
    }
  }
`;

export const GET_FAV_APARTMENTS = gql`
  query {
    favorites {
      id
      title
      details
      date
      geolocation
      address
      city
      price
      buildingType
      adType
      photos
      msquare
      roomCount
      floor
      owner {
        name
        surname
        email
        phone
      }
    }
  }
`;
