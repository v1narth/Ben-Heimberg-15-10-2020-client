import { gql } from "@apollo/client";

export const GetUser = gql`
  {
    user {
      id
      senderId
    }
  }
`;

export const Login = gql`
  mutation($id: String!) {
    login(id: $id) {
      accessToken
      user {
        id
        senderId
      }
    }
  }
`;
