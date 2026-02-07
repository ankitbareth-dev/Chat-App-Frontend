import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import type { ChatUser } from "../../types/chat.types";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

interface ChatState {
  searchResults: ChatUser[];
  isSearching: boolean;
  error: string | null;
  activeChatUser: ChatUser | null;
  chatList: ChatUser[];
  isLoadingList: boolean;
  messages: Message[];
  isTyping: boolean;
}

const initialState: ChatState = {
  searchResults: [],
  isSearching: false,
  error: null,
  activeChatUser: null,
  chatList: [],
  isLoadingList: false,
  messages: [],
  isTyping: false,
};

export const fetchChatList = createAppAsyncThunk<
  ChatUser[],
  void,
  { rejectValue: string }
>("chat/fetchList", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/chats/list`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch chats");

    const data = await res.json();
    return data.data || [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Could not load chat list");
  }
});

export const searchUsers = createAppAsyncThunk<
  ChatUser[],
  string,
  { rejectValue: string }
>("chat/searchUsers", async (phone, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${ENV.API_BASE_URL}/api/user/search?phone=${phone}`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Search failed");

    const data = await res.json();

    return data.data || [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Search failed");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.error = null;
    },
    setActiveChat: (state, action) => {
      state.activeChatUser = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUsers.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isSearching = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload ?? "Search failed";
      })
      .addCase(fetchChatList.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state) => {
        state.isLoadingList = false;
      });
  },
});

export const {
  clearSearchResults,
  setActiveChat,
  addMessage,
  setTyping,
  clearMessages,
} = chatSlice.actions;
export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
