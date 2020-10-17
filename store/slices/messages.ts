import { gql, QueryOptions } from "@apollo/client";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { initializeApollo } from "~/lib/apolloClient";
import { RootState } from "..";

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    type: "received" as "received" | "sent",
    list: [] as Message[],
    userMessages: {
      received: [] as Message[],
      sent: [] as Message[],
    },
    selected: null as Message | null,
    senderId: "" as string | number,
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setSenderId: (state, action) => {
      state.senderId = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    setUserMessages: (state, action) => {
      state.userMessages = action.payload;
    },
  },
});

/**
 * Selectors.
 */
export const messagesList = (state: RootState) =>
  state.messages.senderId || state.user.user
    ? state.messages.userMessages
    : state.messages.list;

/**
 * Delete message.
 *
 * @param {message}
 * @return {void}
 */
export const deleteMessage = (message: Message) => async (
  dispatch: Dispatch,
  getState
) => {
  const apolloClient = initializeApollo();
  const list = messagesList(getState());
  const { messages }: RootState = getState();

  if (Array.isArray(list)) {
    dispatch(
      messagesSlice.actions.setList(list.filter((m) => m.id !== message.id))
    );
  } else {
    dispatch(
      messagesSlice.actions.setUserMessages({
        ...list,
        [messages.type]: list[messages.type].filter((m) => m.id !== message.id),
      })
    );
  }

  try {
    await apolloClient.mutate({
      mutation: gql`
        mutation($id: Int!) {
          deleteOneMessage(where: { id: $id }) {
            id
          }
        }
      `,
      variables: {
        id: Number(message.id),
      },
    });
  } catch (e) {
    console.error(e);
  }
};

/**
 * Set current lists value.
 *
 * @param value
 */
export const setCurrentList = (value: Message) => (
  dispatch: Dispatch,
  getState
) => {
  const list = messagesList(getState());
  const { messages, user }: RootState = getState();

  const action = Array.isArray(list) ? "setList" : "setUserMessages";
  let type = null;

  if (
    value.sender == user.user?.senderId ||
    value.sender == messages.senderId
  ) {
    type = "sent";
  }

  if (
    value.receiver == user.user?.senderId ||
    value.receiver == messages.senderId
  ) {
    type = "received";
  }

  dispatch(
    messagesSlice.actions[action](
      Array.isArray(list)
        ? [value, ...list]
        : { ...list, [type]: [value, ...list[type]] }
    )
  );
};

/**
 * Async operations.
 */
export const fetchMessages = (userId?: number) => async (
  dispatch: Dispatch
) => {
  const apolloClient = initializeApollo();

  let expect = userId ? "userMessages" : "messages";

  const MESSAGES_FRAGMENT = gql`
    fragment MessagesFragment on Message {
      id
      sender
      receiver
      subject
      message
      createdAt
    }
  `;

  const queries = {
    messages: {
      query: gql`
        {
          messages {
            ...MessagesFragment
          }
        }
        ${MESSAGES_FRAGMENT}
      `,
    } as QueryOptions,

    userMessages: {
      query: gql`
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
      `,
      variables: { id: userId },
    } as QueryOptions,
  };

  const { data } = await apolloClient.query(queries[expect]);

  dispatch(
    messagesSlice.actions[userId ? "setUserMessages" : "setList"](data[expect])
  );
};

export default messagesSlice;
