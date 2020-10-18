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
  mutation($id: Int!) {
    login(id: $id) {
      accessToken
      user {
        id
        senderId
      }
    }
  }
`;
