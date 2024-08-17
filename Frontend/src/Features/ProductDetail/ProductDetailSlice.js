import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductDetailById, updateProduct } from "./ProductDetailAPI";

const initialState = {
  product: null,
  status: "idle",
  error: null,
};

export const updateProductAsync = createAsyncThunk(
  "product/updateProductAsync",
  async ({ _id, fieldsToBeUpdated ,navigate}) => {
    try {
      const response = await updateProduct(_id, fieldsToBeUpdated,navigate);
      return { data: response.data, _id, fieldsToBeUpdated };
    } catch (error) {
      console.log("error while updating product", { error });
      throw error;
    }
  }
);

export const fetchProductDetailByIdAsync = createAsyncThunk(
  "productDetail/fetchProductDetailById",
  async (productId) => {
    try {
      const response = await fetchProductDetailById(productId);
      return response;
    } catch (error) {
      console.log("error while fetching product detail", { error });
      throw error;
    }
  }
);

const ProductDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetching product detail
      .addCase(fetchProductDetailByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetailByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.product = action.payload;
      })
      .addCase(fetchProductDetailByIdAsync.rejected, (state) => {
        state.status = "idle";
        state.error = "Something went wrong !!";
      })

      // update product
      .addCase(updateProductAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductAsync.fulfilled, (state, action) => {
        const { fieldsToBeUpdated } = action.payload;
        console.log({fieldsToBeUpdated})
        state.product = { ...state.product, ...fieldsToBeUpdated };
        state.status = "idle";
      })
      .addCase(updateProductAsync.rejected, (state) => {
        state.error = "Something went wrong !!";
        state.status = "idle";
      });
  },
});

export const selectProductById = (state) => state.productDetail;

export default ProductDetailSlice.reducer;
