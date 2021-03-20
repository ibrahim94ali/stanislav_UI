import { gql } from "@apollo/client";

export const GET_APARTMENTS = gql`
  query apartments(
    $city: String
    $minPrice: Int
    $maxPrice: Int
    $minArea: Int
    $maxArea: Int
    $minRoom: Int
    $maxRoom: Int
    $sortBy: String
    $sortOrder: Int
  ) {
    apartments(
      city: $city
      minPrice: $minPrice
      maxPrice: $maxPrice
      minArea: $minArea
      maxArea: $maxArea
      minRoom: $minRoom
      maxRoom: $maxRoom
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
      type
      photos
      msquare
      roomCount
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
      type
      photos
      msquare
      roomCount
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
      type
      photos
      msquare
      roomCount
      owner {
        name
        surname
        email
        phone
      }
    }
  }
`;
