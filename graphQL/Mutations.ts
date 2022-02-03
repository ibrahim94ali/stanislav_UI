import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register(
    $email: String!
    $password: String!
    $name: String!
    $phone: String!
    $type: String!
  ) {
    register(
      email: $email
      password: $password
      name: $name
      phone: $phone
      type: $type
    ) {
      id
      email
      token
      phone
      name
      type
      verified
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($name: String!, $phone: String!, $type: String!) {
    updateUser(name: $name, phone: $phone, type: $type) {
      id
      email
      phone
      name
      type
      verified
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($password: String!, $newPassword: String!) {
    updatePassword(password: $password, newPassword: $newPassword) {
      id
      email
      phone
      name
      type
      verified
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      token
      phone
      name
      verified
      type
    }
  }
`;

export const ADD_APARTMENT = gql`
  mutation AddApartment(
    $title: String!
    $details: String!
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
        phone
        email
        verified
        type
      }
    }
  }
`;

export const UPDATE_APARTMENT = gql`
  mutation UpdateApartment(
    $id: ID!
    $title: String
    $details: String
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
        phone
        email
        verified
        type
      }
    }
  }
`;

export const DELETE_APARTMENT = gql`
  mutation DeleteApartment($id: ID!) {
    deleteApartment(id: $id) {
      id
    }
  }
`;

export const ADD_FAV_APARTMENT = gql`
  mutation AddFavorite($id: ID!) {
    addFavorite(id: $id) {
      id
      title
      details
      owner {
        name
        email
        phone
        verified
        type
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
  mutation RemoveFavorite($id: ID!) {
    removeFavorite(id: $id) {
      id
      title
      details
      owner {
        name
        email
        phone
        verified
        type
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
