import { gql } from "@apollo/client";

export const GET_APARTMENTS = gql`
  query apartments(
    $city: String
    $minPrice: Int
    $maxPrice: Int
    $sortBy: String
    $sortOrder: Int
  ) {
    apartments(
      city: $city
      minPrice: $minPrice
      maxPrice: $maxPrice
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      id
      title
      details
      ownerId
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
