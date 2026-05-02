import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserOrders,
  fetchUserDetails,
  updateUserDetails,
} from "./UserAPI";

const initialState = {
  userInfo: {}, // this is for detailed user info
  status: "idle",
  error: null,
};

export const fetchUserOrdersAsync = createAsyncThunk(
  "user/fetchUserOrders",
  async ({navigate}, { rejectWithValue }) => {
    try {
      const response = await fetchUserOrders(navigate);

      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const fetchUserDetailsAsync = createAsyncThunk(
  "user/fetchUserDetails",
  async ({navigate}, { rejectWithValue }) => {
    try {
      const response = await fetchUserDetails(navigate);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const updateUserDetailsAsync = createAsyncThunk(
  "user/updateUserDetails",
  async ({ newData ,navigate}, { rejectWithValue }) => {
    try {
      const response = await updateUserDetails(newData,navigate);
      return response;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // user orders
      .addCase(fetchUserOrdersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserOrdersAsync.fulfilled, (state, action) => {
        state.userInfo.orders = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUserOrdersAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })

      // user details
      .addCase(fetchUserDetailsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserDetailsAsync.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = "idle";
      })
      .addCase(fetchUserDetailsAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })

      // update user details
      .addCase(updateUserDetailsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserDetailsAsync.fulfilled, (state, action) => {
        state.userInfo = { ...state.userInfo, ...action.payload.newData };
        state.status = "idle";
      })
      .addCase(updateUserDetailsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      });
  },
});

export const selectUserOrderDetails = (state) => state.user.userInfo.orders;
export const selectUserState = (state) => state.user;

export default orderSlice.reducer;
