import { gql, QueryOptions } from "@apollo/client";
import { createSlice, Dispatch } from "@reduxjs/toolkit";
import {
  CreateMessage,
  DeleteMessage,
  FetchMessages,
  FetchUserMessages,
} from "~/graphql/message";
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
 * Creates new message.
 *
 * @param message
 */
export const createMessageAsync = (message: Message) => async (dispatch) => {
  const apolloClient = initializeApollo();

  return await apolloClient.mutate({
    mutation: CreateMessage,
    variables: {
      data: message,
    },
  });
};

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

  return await apolloClient.mutate({
    mutation: DeleteMessage,
    variables: {
      id: Number(message.id),
    },
  });
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
export const fetchMessages = (userId?: string) => async (
  dispatch: Dispatch
) => {
  const apolloClient = initializeApollo();

  let expect = userId ? "userMessages" : "messages";

  const queries = {
    messages: {
      query: FetchMessages,
    } as QueryOptions,

    userMessages: {
      query: FetchUserMessages,
      variables: { id: String(userId) },
    } as QueryOptions,
  };

  const { data } = await apolloClient.query(queries[expect]);

  dispatch(
    messagesSlice.actions[userId ? "setUserMessages" : "setList"](data[expect])
  );
};

export default messagesSlice;
