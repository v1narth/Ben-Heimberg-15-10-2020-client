import { gql } from "@apollo/client";

export const GetUser = gql`
  {
    user {
      id
      senderId
    }
  }
`;

export const Users = gql`
  query($q: String) {
    users(q: $q) {
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

export const Register = gql`
  mutation($id: String!) {
    createOneUser(data: { senderId: $id }) {
      id
      senderId
    }
  }
`;
