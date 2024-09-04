import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchAllCategories,
  fetchAllBrands,
  fetchAllProducts,
  addBrand,
  addCategory
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
  async ({ filter, page, sort, searchParameter ,role}) => {
    try {
      const response = await fetchAllProducts({
        filter,
        page,
        sort,
        searchParameter,
        admin: role==="admin"
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchAllCategoriesAsync = createAsyncThunk(
  "product/fetchAllCategoriesFilter",
  async () => {
    try {
      const response = await fetchAllCategories();
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

export const addBrandAsync = createAsyncThunk(
  "user/addBrand",
  async ({ label ,navigate}) => {
    try {
      console.log({label})
      const response = await addBrand(label,navigate);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const addCategoryAsync = createAsyncThunk(
  "user/addCategory",
  async ({ label ,navigate}) => {
    try {
      console.log({label})
      const response = await addCategory(label,navigate);
      return response.data;
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
        state.products = null;
        state.totalProducts = 0;
      })
      .addCase(fetchAllProductsAsync.fulfilled, (state, action) => {
        state.status.products = "idle";
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchAllProductsAsync.rejected, (state) => {
        state.status.products = "idle";
        state.error.products = "Something went wrong !!";
      })

      // fetch categories
      .addCase(fetchAllCategoriesAsync.pending, (state) => {
        state.status.categories = "loading";
      })
      .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
        state.status.categories = "idle";
        state.filters.categories = action.payload;
      })
      .addCase(fetchAllCategoriesAsync.rejected, (state) => {
        state.status.categories = "idle";
        state.error.categories = "Something went wrong !!";
      })
      // fetch brands
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
      
      // add brand
      .addCase(addBrandAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addBrandAsync.fulfilled, (state ,action) => {
        console.log({action})
        state.filters.brands.push(action.payload)
        state.status = "idle";
      })
      .addCase(addBrandAsync.rejected, (state ) => {
        state.status = "idle";
      })

      // add category
      .addCase(addCategoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addCategoryAsync.fulfilled, (state ,action) => {
        console.log({action})
        state.filters.categories.push(action.payload)
        state.status = "idle";
      })
      .addCase(addCategoryAsync.rejected, (state ) => {
        state.status = "idle";
      })
  },
});

export const { setSearchParameters } = productSlice.actions;

export const selectProductState = (state) => state.product;
export const selectProducts = (state) => state.product.products;
export const selectSearchParameters = (state) => state.product.searchParameters;
export const selectCategories = (state) => state.product.filters.categories;
export const selectBrands = (state) => state.product.filters.brands;


export default productSlice.reducer;
