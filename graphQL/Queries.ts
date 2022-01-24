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
      }
      date
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
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      isFeatured
      amenities
      age
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
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      isFeatured
      amenities
      age
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
      heatingType
      photos
      msquare
      roomCount
      floor
      isFurnished
      amenities
      age
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
