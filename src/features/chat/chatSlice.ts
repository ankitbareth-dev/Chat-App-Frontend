import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import type { ChatUser } from "../../types/chat.types";

interface ChatState {
  searchResults: ChatUser[];
  isSearching: boolean;
  error: string | null;
}

const initialState: ChatState = {
  searchResults: [],
  isSearching: false,
  error: null,
};

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
      });
  },
});

export const { clearSearchResults } = chatSlice.actions;
export const selectChat = (state: RootState) => state.chat;

export default chatSlice.reducer;
