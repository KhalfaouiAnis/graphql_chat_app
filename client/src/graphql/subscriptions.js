import { gql } from "@apollo/client";

export const MESSAGE_SUBSCRIPTION = gql`
  subscription Subscription {
    messageAdded {
      id
      text
      receiverId
      senderId
      createdAt
    }
  }
`;
