import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
}

interface ChatState {
  searchResults: PublicUser[];
  searchLoading: boolean;
  searchError: string | null;
  chatList: PublicUser[];
  chatListLoading: boolean;
  chatListError: string | null;
  activeChatUser: PublicUser | null;
}

const initialState: ChatState = {
  searchResults: [],
  searchLoading: false,
  searchError: null,

  chatList: [],
  chatListLoading: false,
  chatListError: null,

  activeChatUser: null,
};

export const searchUsers = createAppAsyncThunk<
  PublicUser[],
  string,
  { rejectValue: string }
>("chat/searchUsers", async (phone, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${ENV.API_BASE_URL}/api/user/search?phone=${phone}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Search failed");
    }

    const data = await res.json();
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

export const fetchChatList = createAppAsyncThunk<
  PublicUser[],
  void,
  { rejectValue: string }
>("chat/fetchChatList", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/chats/list`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res.json();
      return rejectWithValue(errorData.message || "Failed to fetch chats");
    }

    const data = await res.json();
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
    },
    setActiveChatUser: (state, action) => {
      state.activeChatUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchResults = [];
        state.searchError = action.payload ?? "Failed to fetch users";
      });

    builder
      .addCase(fetchChatList.pending, (state) => {
        state.chatListLoading = true;
        state.chatListError = null;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.chatListLoading = false;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.chatListLoading = false;
        state.chatList = [];
        state.chatListError = action.payload ?? "Failed to load chats";
      });
  },
});

export const selectChat = (state: RootState) => state.chat;
export const { clearSearchResults, setActiveChatUser } = chatSlice.actions;

export default chatSlice.reducer;
