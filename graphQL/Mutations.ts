import {gql} from "@apollo/client";

export const REGISTER_USER = gql`
    mutation register(
        $email: String!
        $password: String!
        $name: String!
        $surname: String!
        $phone: String!) {
        register(
            email: $email
            password: $password
            name: $name
            surname: $surname
            phone: $phone) {
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
    mutation login(
        $email: String!
        $password: String!) {
            login(
            email: $email
            password: $password) {
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
`