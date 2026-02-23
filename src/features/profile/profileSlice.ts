import { createSlice } from "@reduxjs/toolkit";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import type { User, AuthApiSuccessResponse } from "../../types/auth.types";
import type { RootState } from "../../app/store";

interface ProfileState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
  success: false,
};

export const updateUserProfile = createAppAsyncThunk<
  User,
  { name?: string; file?: File | null },
  { rejectValue: string }
>("profile/updateUserProfile", async (data, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.file) {
      formData.append("profilePic", data.file);
    }

    const res = await fetch(`${ENV.API_BASE_URL}/api/user/update-profile`, {
      method: "PATCH",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const errorData: AuthApiSuccessResponse<null> = await res.json();
      return rejectWithValue(errorData.message || "Failed to update profile");
    }

    const result: AuthApiSuccessResponse<User> = await res.json();
    return result.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Update failed";
      });
  },
});

export const { resetProfileState } = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;

export default profileSlice.reducer;
