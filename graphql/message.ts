import { gql } from "@apollo/client";

export const MESSAGES_FRAGMENT = gql`
  fragment MessagesFragment on Message {
    id
    sender
    receiver
    subject
    message
    createdAt
  }
`;

export const FetchMessages = gql`
  query {
    messages {
      ...MessagesFragment
    }
  }
  ${MESSAGES_FRAGMENT}
`;

export const FetchUserMessages = gql`
  query($id: Int) {
    userMessages(id: $id) {
      sent {
        ...MessagesFragment
      }

      received {
        ...MessagesFragment
      }
    }
  }
  ${MESSAGES_FRAGMENT}
`;

export const CreateMessage = gql`
  mutation($data: MessageCreateInput!) {
    createOneMessage(data: $data) {
      ...MessagesFragment
    }
  }
  ${MESSAGES_FRAGMENT}
`;

export const DeleteMessage = gql`
  mutation($id: Int!) {
    deleteOneMessage(where: { id: $id }) {
      id
    }
  }
`;
