import {gql} from "@apollo/client";

export const GET_APARTMENTS = gql`
query {
    apartments {
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