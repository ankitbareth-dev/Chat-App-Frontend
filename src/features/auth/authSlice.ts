import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { createAppAsyncThunk } from "../../app/withTypes";
import { ENV } from "../../app/env";
import type {
  User,
  LoginData,
  SignupData,
  AuthApiSuccessResponse,
} from "../../types/auth.types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  initialLoading: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  initialLoading: true,
  loading: false,
  error: null,
};

export const checkAuth = createAppAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/checkAuth", async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/auth/check-auth`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Not authenticated");
    }

    const data: AuthApiSuccessResponse<User> = await res.json();
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Failed to check authentication status");
  }
});

export const loginUser = createAppAsyncThunk<
  User,
  LoginData,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      const errorBody: AuthApiSuccessResponse<null> = await res.json();
      return rejectWithValue(errorBody.message || "Login failed");
    }

    const data: AuthApiSuccessResponse<User> = await res.json();

    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

export const signupUser = createAppAsyncThunk<
  User,
  SignupData,
  { rejectValue: string }
>("auth/signup", async (userData, { rejectWithValue }) => {
  try {
    const res = await fetch(`${ENV.API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorBody: AuthApiSuccessResponse<null> = await res.json();
      return rejectWithValue(errorBody.message || "Signup failed");
    }

    const data: AuthApiSuccessResponse<User> = await res.json();
    return data.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Unexpected error occurred");
  }
});

export const logoutUser = createAppAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await fetch(`${ENV.API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return rejectWithValue(err.message);
    }
    return rejectWithValue("Logout failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });

    builder
      .addCase(checkAuth.pending, (state) => {
        state.initialLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.initialLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.initialLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const { resetError } = authSlice.actions;

export default authSlice.reducer;
