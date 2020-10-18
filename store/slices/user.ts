import { gql } from "@apollo/client";
import { createSlice } from "@reduxjs/toolkit";
import { GetUser, Login } from "~/graphql/user";
import { initializeApollo } from "~/lib/apolloClient";
import { RootState } from "..";
import messagesSlice from "./messages";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const isLoggedIn = (state: RootState) => !!state.user.user;

export const getUser = () => async (dispatch) => {
  const apollo = initializeApollo();

  const {
    data: { user },
  } = await apollo.query({
    query: GetUser,
  });

  dispatch(messagesSlice.actions.setSenderId(user?.senderId ?? ""));
  dispatch(userSlice.actions.setUser(user));
};

export const login = (id) => async (dispatch) => {
  const apollo = initializeApollo();

  const {
    data: { login },
  } = await apollo.mutate({
    mutation: Login,
    variables: {
      id: Number(id),
    },
  });

  if (login) {
    localStorage.setItem("accessToken", `Bearer ${login.accessToken}`);
    dispatch(userSlice.actions.setUser(login.user));
  }

  return login;
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("accessToken");
  dispatch(userSlice.actions.setUser(null));
};

export default userSlice;
