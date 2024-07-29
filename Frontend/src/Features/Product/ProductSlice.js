import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  fetchAllBrands,
  fetchAllProducts,
} from "./ProductAPI";

const initialState = {
  products: null,
  filters: {
    categories: [],
    brands: [],
  },
  status: {
    products: "idle",
    categories: "idle",
    brands: "idle",
  },
  error: {
    products: null,
    categories: null,
    brands: null,
  },
  searchParameters: "",
  totalProducts: 0,
};

export const fetchAllProductsAsync = createAsyncThunk(
  "product/fetchAllProducts",
  async ({ filter, page, sort, searchParameter }) => {
    try {
      const response = await fetchAllProducts({
        filter,
        page,
        sort,
        searchParameter,
      });
      //  console.log("slice",{response})
      console.log("slice", { response });
      return response;
    } catch (error) {
      // console.log("slice",{error})
      throw error;
    }
  }
);

export const fetchAllCategoriesAsync = createAsyncThunk(
  "product/fetchAllCategoriesFilter",
  async () => {
    try {
      const response = await fetchAllCategories();
      //  console.log({response},"asli")
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAllBrandsAsync = createAsyncThunk(
  "product/fetchAllBrandsFilter",
  async () => {
    try {
      const response = await fetchAllBrands();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);


const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSearchParameters: (state, action) => {
      state.searchParameters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch products
      .addCase(fetchAllProductsAsync.pending, (state) => {
        state.status.products = "loading";
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        (state.status.products = "idle"), console.log("filters", { action });
        (state.products = action.payload.products),
          (state.totalProducts = action.payload.totalProducts);
      })
      .addCase(fetchAllProductsAsync.rejected, (state) => {
        (state.status.products = "idle"),
          (state.error.products = "Something went wrong !!");
      })
      // by categories
      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.status.categories = "loading";
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        console.log({ action });
        (state.status.categories = "idle"),
          (state.filters.categories = action.payload);
      })
      .addCase(fetchAllCategoriesAsync.rejected, (state) => {
        (state.status.categories = "idle"),
          (state.error.categories = "Something went wrong !!");
      })
      // brands
      .addCase(fetchAllBrandsAsync.pending, (state) => {
        state.status.brands = "loading";
      })
      .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
        (state.status.brands = "idle"), (state.filters.brands = action.payload);
      })
      .addCase(fetchAllBrandsAsync.rejected, (state, action) => {
        (state.status.brands = "idle"),
          (state.error.brands = "Something went wrong !!");
      })

  },
});

export const { setSearchParameters } = productSlice.actions;

export const selectProducts = (state) => state.product.products;
export const selectSearchParameters = (state) => state.product.searchParameters;
export const selectCategories = (state) => state.product.filters.categories;
export const selectBrands = (state) => state.product.filters.brands;

export default productSlice.reducer;
