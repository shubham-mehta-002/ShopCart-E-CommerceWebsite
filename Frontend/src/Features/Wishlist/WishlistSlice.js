import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "./WishlistAPI";

const initialState = {
  wishlistItems: [],
  status: "idle",
  error: null,
};

export const fetchAllWishlistItemsAsync = createAsyncThunk(
  "cart/fetchAllWishlistItems",
  async ({navigate}, { rejectWithValue }) => {
    try {
      const response = await fetchAllWishlistItems(navigate);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "cart/addToWishlist",
  async ({ productId,navigate }, { rejectWithValue }) => {
    try {
      const response = await addToWishlist(productId,navigate);
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "cart/removeFromWishlist",
  async ({ productId ,navigate}, { rejectWithValue }) => {
    try {
      const response = await removeFromWishlist(productId,navigate);
      return { data: response.data, productId };
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all wishlist items
      .addCase(fetchAllWishlistItemsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllWishlistItemsAsync.fulfilled, (state, action) => {
        state.wishlistItems = action.payload;
        state.status = "idle";
      })
      .addCase(fetchAllWishlistItemsAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })

      // add item to wishlist
      .addCase(addToWishlistAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishlistAsync.fulfilled, (state, action) => {
        if (
          !state.wishlistItems.find(
            (item) => item._id.toString() === action.payload._id.toString()
          )
        ) {
          state.wishlistItems.push(action.payload);
        }
        state.status = "idle";
      })
      .addCase(addToWishlistAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })

      // remove item from wishlist
      .addCase(removeFromWishlistAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlistAsync.fulfilled, (state, action) => {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item._id.toString() !== action.payload.productId.toString()
        );
        state.status = "idle";
      })
      .addCase(removeFromWishlistAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      });
  },
});

export const selectWishlistStatus = (state) => state.wishlist.status;
export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export default wishlistSlice.reducer;
