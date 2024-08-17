import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPasswordRequest,
  resetPassword,
} from "./AuthAPI";
import Cookies from "js-cookie";

const initialState = {
  error: null,
  status: "idle",
  loggedInUser: { userId: null, role: null },
  isUserRegistered: false,
  role: null,
  mailSent: false,
  isPasswordReset: false,
};

export const registerUserAsync = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password }) => {
    try {
      const response = await registerUser(email, password);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const loginUserAsync = createAsyncThunk(
  "auth/loginUser",
  async ({ email,password ,navigate }) => {
    try {
      const response = await loginUser(email, password,navigate);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const logoutUserAsync = createAsyncThunk("auth/logoutUser", async () => {
  try {
    const response = await logoutUser();
    return response;
  } catch (error) {
    throw error;
  }
});

export const resetPasswordRequestAsync = createAsyncThunk(
  "auth/resetPasswordRequest",
  async ({ email }) => {
    try {
      const response = await resetPasswordRequest(email);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, token, email }) => {
    try {
      const response = await resetPassword({ password, token, email });
      return response;
    } catch (error) {
      throw error;
    }
  }
);

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetRegistrationStatus(state) {
      state.isUserRegistered = false;
    },
    resetPasswordResetStatus(state) {
      state.isPasswordReset = false;
    },
    setLoggedInUserState(state, action) {
      state.loggedInUser = {
        userId: action.payload.userId,
        role: action.payload.role,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // register user
      .addCase(registerUserAsync.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(registerUserAsync.fulfilled, (state, action) => {
        state.isUserRegistered = true;
        state.status = "idle";
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })

      // login user
      .addCase(loginUserAsync.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(loginUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        if (Cookies.get("loggedInUserInfo")) {
          const user = JSON.parse(Cookies.get("loggedInUserInfo"));
          state.loggedInUser = {
            userId: user.userId,
            role: user.role,
          };
        }
      })
      .addCase(loginUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })

      // logout
      .addCase(logoutUserAsync.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(logoutUserAsync.fulfilled, (state, action) => {
        state.loggedInUser = { userId: null, role: null };
        state.status = "idle";
      })
      .addCase(logoutUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.error.message;
      })

      // reset password request
      .addCase(resetPasswordRequestAsync.pending, (state) => {
        state.error = null;
        state.mailSent = true;
        state.status = "loading";
      })
      .addCase(resetPasswordRequestAsync.fulfilled, (state, action) => {
        state.mailSent = false;
        state.status = "idle";
      })
      .addCase(resetPasswordRequestAsync.rejected, (state, action) => {
        state.status = "idle";
        state.mailSent = false;
        state.error = action.error.message;
      })
      // reset password
      .addCase(resetPasswordAsync.pending, (state) => {
        state.error = null;
        state.status = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state) => {
        state.isPasswordReset = true;
        state.status = "idle";
      })
      .addCase(resetPasswordAsync.rejected, (state, action) => {
        state.status = "idle";
        state.isPasswordReset = false;
        state.error = action.error.message;
      });
  },
});

export const selectLoggedInUser = (state) => state.auth.loggedInUser;
export const selectRegistrationStatus = (state) => state.auth.isUserRegistered;
export const selectAuthState = (state) => state.auth;
export const selectMailSentStatus = (state) => state.auth.mailSent;
export const selectAuthStatus = (state) => state.auth.status;
export const selectPasswordResetStatus = (state) => state.auth.isPasswordReset;

export const {
  resetRegistrationStatus,
  setLoggedInUserState,
  resetPasswordResetStatus,
} = AuthSlice.actions;
export default AuthSlice.reducer;
