import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "../features/auth/authSlice";
import chatReducer from "../features/chat/chatSlice";
import profileReducer from "../features/profile/profileSlice";

const chatPersistConfig = {
  key: "chat",
  storage,
  blacklist: [
    "searchResults",
    "searchLoading",
    "searchError",
    "chatListLoading",
    "chatListError",
    "activeChatUser",
    "isLoadingHistory",
    "historyError",
    "isRemoteTyping",
  ],
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat: persistReducer(chatPersistConfig, chatReducer),
  profile: profileReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;
