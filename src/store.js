import { configureStore } from '@reduxjs/toolkit';
import userSlice from './slices/userSlice';
import activeChatSlice from './slices/activeChatSlice';

export default configureStore({
  reducer: {
    userLoginInfo:userSlice,
    activeChat:activeChatSlice
  },
})