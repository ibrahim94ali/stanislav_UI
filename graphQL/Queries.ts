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
    $isFeatured: Boolean
    $isFurnished: Boolean
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
      isFeatured: $isFeatured
      isFurnished: $isFurnished
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
      isFurnished
      isFeatured
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
      isFurnished
      isFeatured
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
      isFurnished
      isFeatured
      owner {
        name
        surname
        email
        phone
      }
    }
  }
`;

export const GET_FEATURED_APARTMENTS = gql`
  query {
    featuredApartments {
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
      isFurnished
      owner {
        name
        surname
        email
        phone
      }
    }
  }
`;

export const GET_SEARCHED_APARTMENTS = gql`
  query searchedApartments($q: String!) {
    searchedApartments(q: $q) {
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
      isFurnished
      isFeatured
    }
  }
`;
