import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import { logoutUser } from "../auth/authSlice";

export interface PublicUser {
  id: string;
  name: string;
  phone: string;
  profilePicture: string;
  isOnline?: boolean;
  lastSeen?: string;
  unreadCount?: number;
}
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  status?: "sending" | "sent";
  seenAt?: string;
  type: "TEXT" | "VOICE" | "IMAGE" | "VIDEO" | "PDF";
  duration?: number;

  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  thumbnailUrl?: string;
}

type PaginationState = {
  currentPage: number;
  hasMore: boolean;
};

interface ChatState {
  searchResults: PublicUser[];
  searchLoading: boolean;
  searchError: string | null;
  chatList: PublicUser[];
  chatListLoading: boolean;
  chatListError: string | null;
  activeChatUser: PublicUser | null;

  messages: Record<string, Message[]>;

  isLoadingHistory: boolean;
  historyError: string | null;

  pagination: Record<string, PaginationState>;
}

const initialState: ChatState = {
  searchResults: [],
  searchLoading: false,
  searchError: null,

  chatList: [],
  chatListLoading: false,
  chatListError: null,

  activeChatUser: null,

  messages: {},
  isLoadingHistory: false,
  historyError: null,
  pagination: {},
};

export const fetchChatHistory = createAppAsyncThunk<
  {
    messages: Message[];
    currentPage: number;
    hasMore: boolean;
    receiverId: string;
  },
  { receiverId: string; page: number },
  { rejectValue: string }
>(
  "chat/fetchChatHistory",
  async ({ receiverId, page }, { rejectWithValue }) => {
    try {
      const limit = 20;
      const res = await fetch(
        `${ENV.API_BASE_URL}/api/chats/history?receiverId=${receiverId}&page=${page}&limit=${limit}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Failed to fetch history");
      }

      const data = await res.json();

      const hasMore = data.data.messages.length === limit;

      return {
        messages: data.data.messages,
        currentPage: page,
        hasMore,
        receiverId,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Unexpected error occurred");
    }
  },
);

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

      state.historyError = null;

      if (action.payload) {
        const userIndex = state.chatList.findIndex(
          (u) => u.id === action.payload.id,
        );
        if (userIndex !== -1) {
          state.chatList[userIndex].unreadCount = 0;
        }
      }
    },
    handleIncomingMessage: (state, action) => {
      const message = action.payload;
      const senderId = message.senderId;

      const userIndex = state.chatList.findIndex((u) => u.id === senderId);

      if (userIndex !== -1) {
        const user = state.chatList.splice(userIndex, 1)[0];
        user.unreadCount = (user.unreadCount || 0) + 1;
        state.chatList.unshift(user);
      } else {
        if (message.sender) {
          const newUser: PublicUser = {
            id: senderId,
            name: message.sender.name,
            profilePicture: message.sender.profilePicture,
            phone: "",
            isOnline: true,
            unreadCount: 1,
          };
          state.chatList.unshift(newUser);
        }
      }

      // NEW: Add message to the specific user's list in the map
      if (!state.messages[senderId]) {
        state.messages[senderId] = [];
      }
      state.messages[senderId].push(message);
    },

    addMessage: (state, action) => {
      const msg = action.payload;

      const chatId = state.activeChatUser?.id;

      if (!chatId) return;

      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(msg);
    },
    updateMessageStatus: (state, action) => {
      const { content, senderId, confirmedMessage } = action.payload;
      const receiverId = confirmedMessage.receiverId;

      // Find message in the specific user's list
      const userMessages = state.messages[receiverId];
      if (userMessages) {
        const index = userMessages.findIndex(
          (msg) =>
            msg.content === content &&
            msg.senderId === senderId &&
            msg.status === "sending",
        );
        if (index !== -1) {
          userMessages[index] = {
            ...confirmedMessage,
            status: "sent",
          };
        }
      }
    },

    updateUserStatus: (state, action) => {
      const { userId, isOnline, lastSeen } = action.payload;

      const userInList = state.chatList.find((u) => u.id === userId);
      if (userInList) {
        userInList.isOnline = isOnline;
        if (lastSeen) userInList.lastSeen = lastSeen;
      }

      const userInSearch = state.searchResults.find((u) => u.id === userId);
      if (userInSearch) {
        userInSearch.isOnline = isOnline;
        if (lastSeen) userInSearch.lastSeen = lastSeen;
      }

      if (state.activeChatUser && state.activeChatUser.id === userId) {
        state.activeChatUser.isOnline = isOnline;
        if (lastSeen) state.activeChatUser.lastSeen = lastSeen;
      }
    },
    setMessagesSeen: (state, action) => {
      const { by, timestamp, myId } = action.payload;

      const userMessages = state.messages[by];
      if (userMessages) {
        userMessages.forEach((msg) => {
          if (msg.senderId === myId && !msg.seenAt) {
            msg.seenAt = timestamp;
          }
        });
      }
    },
    addUserToChatList: (state, action) => {
      const user = action.payload;

      const exists = state.chatList.some((u) => u.id === user.id);
      if (!exists) {
        state.chatList.unshift(user);
      }
    },

    updateOptimisticUrl: (state, action) => {
      const {
        tempId,
        url,
        thumbnailUrl,
        fileName,
        fileSize,
        mimeType,
        duration,
      } = action.payload;
      const chatId = state.activeChatUser?.id;
      if (!chatId) return;

      const userMessages = state.messages[chatId];
      if (userMessages) {
        const index = userMessages.findIndex((msg) => msg.id === tempId);
        if (index !== -1) {
          userMessages[index].content = url;
          userMessages[index].status = "sending";

          if (thumbnailUrl) userMessages[index].thumbnailUrl = thumbnailUrl;
          if (fileName) userMessages[index].fileName = fileName;
          if (fileSize) userMessages[index].fileSize = fileSize;
          if (mimeType) userMessages[index].mimeType = mimeType;
          if (duration) userMessages[index].duration = duration;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoadingHistory = true;
        state.historyError = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoadingHistory = false;
        const { messages, currentPage, hasMore, receiverId } = action.payload;

        if (!state.messages[receiverId]) {
          state.messages[receiverId] = [];
        }

        if (currentPage === 1) {
          // Replace for fresh load
          state.messages[receiverId] = messages.reverse();
        } else {
          // Prepend for pagination
          state.messages[receiverId] = [
            ...messages.reverse(),
            ...state.messages[receiverId],
          ];
        }

        // Update pagination map
        state.pagination[receiverId] = {
          currentPage,
          hasMore,
        };
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoadingHistory = false;
        state.historyError = action.payload ?? "Failed to load messages";
      });

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

    builder.addCase(logoutUser.fulfilled, () => {
      return initialState;
    });
  },
});

export const selectChat = (state: RootState) => state.chat;

export const selectActiveChatMessages = (state: RootState) => {
  const { activeChatUser, messages } = state.chat;
  if (!activeChatUser) return [];
  return messages[activeChatUser.id] || [];
};

export const selectActiveChatPagination = (state: RootState) => {
  const { activeChatUser, pagination } = state.chat;
  if (!activeChatUser) return { currentPage: 1, hasMore: true };
  return pagination[activeChatUser.id] || { currentPage: 1, hasMore: true };
};

export const {
  clearSearchResults,
  setActiveChatUser,
  addMessage,
  updateMessageStatus,
  updateUserStatus,
  handleIncomingMessage,
  setMessagesSeen,
  addUserToChatList,
  updateOptimisticUrl,
} = chatSlice.actions;

export default chatSlice.reducer;
