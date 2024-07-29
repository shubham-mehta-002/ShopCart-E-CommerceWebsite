import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAllWishlistItems ,addToWishlist , removeFromWishlist} from "./WishlistAPI";

const initialState = {
  wishlistItems: [],
  status: "idle",
  error: null,
};

export const fetchAllWishlistItemsAsync = createAsyncThunk(
  "cart/fetchAllWishlistItems",
  async () => {
    try {
      const response = await fetchAllWishlistItems();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addToWishlistAsync = createAsyncThunk(
  "cart/addToWishlist",
  async ({productId}) => {
    console.log("add to wishlsit called ")
    try {
      const response = await addToWishlist(productId);
      return (response.data)
    } catch (error) {
      throw error;
    }
  }
);

export const removeFromWishlistAsync = createAsyncThunk(
  "cart/removeFromWishlist",
  async ({productId}) => {
    try {
      const response = await removeFromWishlist(productId);
      return ({data:response.data , productId});
    } catch (error) {
      throw error;
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
    .addCase(fetchAllWishlistItemsAsync.pending , (state)=>{
      state.status = "loading"
    }) 
    .addCase(fetchAllWishlistItemsAsync.fulfilled , (state,action)=>{
      console.log("wishlist get items action",{action})
      state.wishlistItems = action.payload
      state.status = "idle"
    }) 
    .addCase(fetchAllWishlistItemsAsync.rejected , (state,error)=>{
      console.log("get wihslist error",{error})
      state.status = "idle"
    }) 

     // add item to wishlist
    .addCase(addToWishlistAsync.pending , (state)=>{
      state.status = "loading"
    }) 
    .addCase(addToWishlistAsync.fulfilled , (state,action)=>{
      console.log("wishlist add items action",{action})
      if(state.wishlistItems.find((item) =>  item._id.toString() !== action.payload._id.toString())){
      state.wishlistItems.push(action.payload)
    }
      state.status = "idle"
    }) 
    .addCase(addToWishlistAsync.rejected , (state,error)=>{
      console.log("add wihslist error",{error})
      state.status = "idle"
    }) 

    // remove item from wishlist
    .addCase(removeFromWishlistAsync.pending , (state)=>{
      state.status = "loading"
    }) 
    .addCase(removeFromWishlistAsync.fulfilled , (state,action)=>{
      state.wishlistItems = state.wishlistItems.filter((item)=>item._id.toString() !== action.payload.productId.toString() )
      state.status = "idle"
    }) 
    .addCase(removeFromWishlistAsync.rejected , (state,error)=>{
      console.log("remove wihslist error",{error})
      state.status = "idle"
    }) 
  },
});

export const selectWishlistItems = (state) => state.wishlist.wishlistItems;
export default wishlistSlice.reducer;
