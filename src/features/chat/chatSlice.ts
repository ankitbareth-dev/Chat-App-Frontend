import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import type { ChatUser, ChatMessage } from "../../types/chat.types";

interface ChatState {
  chatList: ChatUser[];
  activeChatUser: ChatUser | null;
  messages: ChatMessage[];
  searchQuery: string;
  searchResults: ChatUser[];
  isLoadingList: boolean;
  isLoadingMessages: boolean;
  isSending: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chatList: [],
  activeChatUser: null,
  messages: [],
  searchQuery: "",
  searchResults: [],
  isLoadingList: false,
  isLoadingMessages: false,
  isSending: false,
  error: null,
};

// --- THUNKS ---

// 1. Fetch Chat List (Sidebar)
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
    const data: ChatUser[] = await res.json();
    return data.data || []; // Assuming { success, message, data: [...] }
  } catch (err) {
    return rejectWithValue("Could not load chat list");
  }
});

// 2. Search Users
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
    const data: ChatUser[] = await res.json();
    return data.data || [];
  } catch (err) {
    return rejectWithValue("Search failed");
  }
});

// 3. Fetch Messages
export const fetchMessages = createAppAsyncThunk<
  ChatMessage[],
  { receiverId: string; page: number },
  { rejectValue: string }
>("chat/fetchMessages", async ({ receiverId, page }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${ENV.API_BASE_URL}/api/chats/history?receiverId=${receiverId}&page=${page}`,
      {
        credentials: "include",
      },
    );
    if (!res.ok) throw new Error("Failed to fetch messages");

    // Response: { success, message, data: { messages, ... } }
    const json = await res.json();
    return json.data.messages || [];
  } catch (err) {
    return rejectWithValue("Failed to load messages");
  }
});

// 4. Send Message
export const sendMessage = createAppAsyncThunk<
  ChatMessage,
  { receiverId: string; content: string },
  { rejectValue: string }
>("chat/sendMessage", async ({ receiverId, content }, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/chats/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ receiverId, content }),
    });
    if (!res.ok) throw new Error("Failed to send");
    const json = await res.json();
    return json.data;
  } catch (err) {
    return rejectWithValue("Could not send message");
  }
});

// --- SLICE ---

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatUser = action.payload;
      state.messages = []; // Clear messages when switching chats
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchChatList.pending, (state) => {
        state.isLoadingList = true;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.isLoadingList = false;
        state.chatList = action.payload;
      })
      .addCase(fetchChatList.rejected, (state) => {
        state.isLoadingList = false;
      })
      // Search Users
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.searchResults = action.payload;
      })
      // Fetch Messages
      .addCase(fetchMessages.pending, (state) => {
        state.isLoadingMessages = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isLoadingMessages = false;
        // If page 1, replace. If page > 1, prepend (for load more)
        // For simplicity, we are just loading fresh for now in this snippet
        state.messages = [...action.payload.reverse(), ...state.messages];
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
      });
  },
});

export const { setActiveChat, setSearchQuery, resetError } = chatSlice.actions;
export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
