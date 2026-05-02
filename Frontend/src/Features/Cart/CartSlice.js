import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllCartItems,
  addItemToCart,
  reduceCartItemQuantity,
  removeCartItem,
} from "./CartAPI";

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

export const fetchAllCartItemsAsync = createAsyncThunk(
  "cart/fetchAllCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchAllCartItems();
      return response.data;
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const addItemToCartAsync = createAsyncThunk(
  "cart/addItemToCartAsync",
  async ({ productDetails ,navigate }, { rejectWithValue }) => {
    try {
      const response = await addItemToCart(productDetails,navigate);
      return { data: response.data, productDetails };
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const reduceCartItemQuantityAsync = createAsyncThunk(
  "cart/reduceCartItemQuantityAsync",
  async ({ productDetails ,navigate}, { rejectWithValue }) => {
    try {
      const response = await reduceCartItemQuantity(productDetails,navigate);
      return { data: response.data, productDetails };
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

export const removeCartItemAsync = createAsyncThunk(
  "cart/removeCartItemAsync",
  async ({ productDetails ,navigate}, { rejectWithValue }) => {
    try {
      const response = await removeCartItem(productDetails,navigate);
      return { data: response.data, productDetails };
    } catch (error) {
      return rejectWithValue(typeof error === 'string' ? error : (error?.response?.data?.message || error?.message || 'Something went wrong'));
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // to fetch cart items
      .addCase(fetchAllCartItemsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCartItemsAsync.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.status = "idle";
      })
      .addCase(fetchAllCartItemsAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      })

      // to add items to cart
      .addCase(addItemToCartAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addItemToCartAsync.fulfilled, (state, action) => {
        const { productDetails } = action.payload;
        const { productId, color, size, quantity, colorCode } = productDetails;
        const existingProduct = state.cartItems.find(
          (item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
        );
        if (existingProduct) {
          if (existingProduct.quantity < 5) {
            existingProduct.quantity += productDetails.quantity;
          }
        } else {
          state.cartItems.push({
            product: productId,
            quantity,
            size,
            color,
            colorCode,
          });
        }
        state.status = "idle";
      })
      .addCase(addItemToCartAsync.rejected, (state, action) => {
        state.status = "idle";

        state.error = action.payload;
      })

      // to reduce quantity
      .addCase(reduceCartItemQuantityAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(reduceCartItemQuantityAsync.fulfilled, (state, action) => {
        const { productDetails } = action.payload;
        const { productId, color, size, quantity, colorCode } = productDetails;
        const existingProduct = state.cartItems.find(
          (item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
        );

        if (existingProduct.quantity === 1) {
          state.cartItems = state.cartItems.filter((item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
              ? false
              : true
          );
        } else {
          state.cartItems = state.cartItems.map((item) =>
            item.product._id === productId &&
            item.color === color &&
            item.size === size
              ? { ...item, quantity: item.quantity - 1 }
              : { ...item }
          );
        }

        state.status = "idle";
      })
      .addCase(reduceCartItemQuantityAsync.rejected, (state, action) => {
        state.status = "idle";

        state.error = action.payload;
      })

      // remove from cart
      .addCase(removeCartItemAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeCartItemAsync.fulfilled, (state, action) => {
        const { productDetails } = action.payload;
        const { productId, color, size } = productDetails;

        state.cartItems = state.cartItems.filter((item) =>
          item.product._id.toString() === productId.toString() &&
          item.size === size &&
          item.color === color
            ? false
            : true
        );
        state.status = "idle";
      })
      .addCase(removeCartItemAsync.rejected, (state, action) => {
        state.error = action.payload;
        state.status = "idle";
      });
  },
});

export const selectCartState = (state) => state.cart;
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCartStatus = (state) => state.cart.status

export default cartSlice.reducer;
