import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation register(
    $email: String!
    $password: String!
    $name: String!
    $surname: String!
    $phone: String
  ) {
    register(
      email: $email
      password: $password
      name: $name
      surname: $surname
      phone: $phone
    ) {
      id
      email
      token
      phone
      name
      surname
      roles
      verified
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      token
      phone
      name
      surname
      roles
      verified
    }
  }
`;

export const ADD_APARTMENT = gql`
  mutation addApartment(
    $title: String!
    $details: String!
    $date: String!
    $geolocation: [Float]!
    $address: String!
    $city: String!
    $price: Int!
    $buildingType: String!
    $adType: String!
    $heatingType: String!
    $photos: [Upload]
    $msquare: Int!
    $roomCount: Int!
    $floor: Int!
    $isFurnished: Boolean!
    $amenities: [String]!
    $age: Int!
    $isWheelChairAccessible: Boolean!
  ) {
    addApartment(
      title: $title
      details: $details
      date: $date
      geolocation: $geolocation
      address: $address
      city: $city
      price: $price
      buildingType: $buildingType
      adType: $adType
      heatingType: $heatingType
      photos: $photos
      msquare: $msquare
      roomCount: $roomCount
      floor: $floor
      isFurnished: $isFurnished
      amenities: $amenities
      age: $age
      isWheelChairAccessible: $isWheelChairAccessible
    ) {
      id
      ownerId
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
      isWheelChairAccessible
      owner {
        name
        surname
        phone
        email
      }
    }
  }
`;

export const UPDATE_APARTMENT = gql`
  mutation updateApartment(
    $id: ID!
    $title: String
    $details: String
    $date: String
    $geolocation: [Float]
    $address: String
    $city: String
    $price: Int
    $buildingType: String
    $adType: String
    $heatingType: String
    $oldPhotosLinks: [String]
    $newPhotos: [Upload]
    $msquare: Int
    $roomCount: Int
    $floor: Int
    $isFurnished: Boolean
    $amenities: [String]
    $age: Int
    $isWheelChairAccessible: Boolean
  ) {
    updateApartment(
      id: $id
      title: $title
      details: $details
      date: $date
      geolocation: $geolocation
      address: $address
      city: $city
      price: $price
      buildingType: $buildingType
      adType: $adType
      heatingType: $heatingType
      oldPhotosLinks: $oldPhotosLinks
      newPhotos: $newPhotos
      msquare: $msquare
      roomCount: $roomCount
      floor: $floor
      isFurnished: $isFurnished
      amenities: $amenities
      age: $age
      isWheelChairAccessible: $isWheelChairAccessible
    ) {
      id
      ownerId
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
      isWheelChairAccessible
      owner {
        name
        surname
        phone
        email
      }
    }
  }
`;

export const DELETE_APARTMENT = gql`
  mutation deleteApartment($id: ID!) {
    deleteApartment(id: $id) {
      id
    }
  }
`;

export const ADD_FAV_APARTMENT = gql`
  mutation addFavorite($id: ID!) {
    addFavorite(id: $id) {
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
      isFavorite
      floor
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
    }
  }
`;

export const REMOVE_FAV_APARTMENT = gql`
  mutation removeFavorite($id: ID!) {
    removeFavorite(id: $id) {
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
      isFavorite
      floor
      isFurnished
      isFeatured
      amenities
      age
      isWheelChairAccessible
    }
  }
`;
