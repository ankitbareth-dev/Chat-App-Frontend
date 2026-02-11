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
}

const initialState: ChatState = {
  searchResults: [],
  searchLoading: false,
  searchError: null,
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

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchError = null;
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
  },
});

export const selectChat = (state: RootState) => state.chat;
export const { clearSearchResults } = chatSlice.actions;

export default chatSlice.reducer;
