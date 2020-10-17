import { configureStore } from '@reduxjs/toolkit'
import messagesSlice from './slices/messages'
import userSlice from './slices/user'

const store = configureStore({
  reducer: {
    messages: messagesSlice.reducer,
    user: userSlice.reducer
  },
  devTools: true
})

export type RootState = ReturnType<typeof store.getState>

export default store