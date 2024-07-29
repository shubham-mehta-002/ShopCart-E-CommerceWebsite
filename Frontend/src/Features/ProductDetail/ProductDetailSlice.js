import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProductDetailById  , updateProduct} from "./ProductDetailAPI";

const initialState = {
  product: null,
  status: "idle",
  error: null,
};

export const updateProductAsync = createAsyncThunk(
  "product/updateProductAsync",
  async ({ _id, fieldsToBeUpdated }) => {
    console.log("sdadas", { _id, fieldsToBeUpdated });
    try {
      const response = await updateProduct(_id, fieldsToBeUpdated);
      return { data: response.data, _id, fieldsToBeUpdated };
    } catch (error) {
      // console.log({error})
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
      // console.log({error})
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
      .addCase(fetchProductDetailByIdAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductDetailByIdAsync.fulfilled, (state, action) => {
        state.status = "idle";
        // console.log({action})
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
        console.log({ action });
        const { fieldsToBeUpdated, _id } = action.payload;
        console.log({ fieldsToBeUpdated });
        // state.products = state.products.map((product) => {
        //   if (product._id === _id) {
        //     return { ...product, ...fieldsToBeUpdated };
        //   } else {
        //     return product;
        //   }
        // });
        state.product = {...state.product , ...fieldsToBeUpdated}
        state.status = "idle";
      })
      .addCase(updateProductAsync.rejected, (state, action) => {
        state.error = "Something went wrong !!";
        state.status = "idle";
      });
  },
});

export const selectProductById = (state) => state.productDetail;

export default ProductDetailSlice.reducer;
