import { gql } from "@apollo/client";

export const GET_APARTMENTS = gql`
  query apartments(
    $city: String
    $buildingType: String
    $adType: String
    $heatingType: String
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
    $amenities: [String]
    $age: Int
    $sortBy: String
    $sortOrder: Int
    $limit: Int
    $offset: Int
    $isWheelChairAccessible: Boolean
  ) {
    apartments(
      city: $city
      buildingType: $buildingType
      adType: $adType
      heatingType: $heatingType
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
      amenities: $amenities
      age: $age
      sortBy: $sortBy
      sortOrder: $sortOrder
      limit: $limit
      offset: $offset
      isWheelChairAccessible: $isWheelChairAccessible
    )
      @connection(
        key: "apartments"
        filter: [
          "city"
          "buildingType"
          "adType"
          "heatingType"
          "minPrice"
          "maxPrice"
          "minArea"
          "maxArea"
          "minRoom"
          "maxRoom"
          "minFloor"
          "maxFloor"
          "isFurnished"
          "amenities"
          "age"
          "sortBy"
          "sortOrder"
          "isWheelChairAccessible"
        ]
      ) {
      id
      title
      details
      owner {
        name
        surname
        email
        phone
        type
        verified
      }
      createdAt
      modifiedAt
      geolocation
      address
      city
      price
      buildingType
      adType
      heatingType
      photos
      msquare
      roomCount
      floor
      isFavorite
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
    }
  }
`;

export const GET_MY_APARTMENTS = gql`
  query {
    myApartments {
      id
      title
      details
      createdAt
      modifiedAt
      geolocation
      address
      city
      price
      buildingType
      adType
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
    }
  }
`;

export const GET_FAV_APARTMENTS = gql`
  query {
    favorites {
      id
      title
      details
      createdAt
      modifiedAt
      geolocation
      address
      city
      price
      buildingType
      adType
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
      owner {
        name
        surname
        email
        phone
        type
        verified
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
      createdAt
      modifiedAt
      geolocation
      address
      city
      price
      buildingType
      adType
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      amenities
      age
      isWheelChairAccessible
      owner {
        name
        surname
        email
        phone
        type
        verified
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
        type
        verified
      }
      createdAt
      modifiedAt
      geolocation
      address
      city
      price
      buildingType
      adType
      heatingType
      photos
      msquare
      roomCount
      floor
      isFavorite
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
    }
  }
`;

export const GET_CITIES = gql`
  query {
    cities {
      value
      label
      url
    }
  }
`;

export const GET_SPONSORS = gql`
  query {
    sponsors {
      name
      logoUrl
      redirectUrl
    }
  }
`;
