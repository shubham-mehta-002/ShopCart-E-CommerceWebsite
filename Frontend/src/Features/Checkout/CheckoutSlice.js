import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {fetchUserDetails , addUserAddress , createOrder ,fetchUserOrders} from "./CheckoutAPI"

const initialState = {
  currentOrder:{
    isOrderPlaced : false,
    orderId : null
  },
  ordersList : [],
  user:{
    address:[],
    email:""
  },
  status: "idle",
  error: null,
};

export const fetchUserDetailsAsync = createAsyncThunk(
  "order/fetchUserDetails",
  async () => {
    try {
      const response = await fetchUserDetails();
      console.log({response})
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


export const addUserAddressAsync = createAsyncThunk(
  "order/addUserAddress",
  async ({addressDetails}) => {
    try {
      const response = await addUserAddress(addressDetails);
      console.log('add address',{response})
      return {data : response.data , addressDetails};
    } catch (error) {
      console.log("add address slice",{error})
      throw error;
    }
  }
);


export const createOrderAsync = createAsyncThunk(
  "order/createOrder",
  async ({orderDetails}) => {
    try {
      const response = await createOrder(orderDetails);
      console.log('create Order',{response})
      return {data : response.data , orderDetails};
    } catch (error) {
      console.log("create Order slice",{error})
      throw error;
    }
  }
);


export const fetchUserOrdersAsync = createAsyncThunk(
  "order/fetchUserOrders",
  async () => {
    try {
      const response = await fetchUserOrders();
      console.log({response})
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);


const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetCurrentOrderStatus (state,action){
      state.currentOrder = {
        isOrderPlaced : false , 
        orderId : null
      }
    }
  },
  extraReducers: (builder) => {
    builder
    // fetch user details : address,email,fullname,phone
        .addCase(fetchUserDetailsAsync.pending , (state)=>{
            state.status ="loading"
        })
        .addCase(fetchUserDetailsAsync.fulfilled , (state , action)=>{
            state.status ="idle"
            console.log('userDetails',{action})
            state.user = action.payload
        })
        .addCase(fetchUserDetailsAsync.rejected , (state , action)=>{
            state.status ="idle"
            console.log({action})
        })

        // add address
        .addCase(addUserAddressAsync.pending , (state)=>{
          state.status ="loading"
        })
        .addCase(addUserAddressAsync.fulfilled , (state , action)=>{
            state.status ="idle"
            console.log('order',{action})
            state.user.address.push(action.payload.addressDetails)
        })
        .addCase(addUserAddressAsync.rejected , (state   , action)=>{
            state.status ="idle"
            console.log({action})
        })

        // create order
        .addCase(createOrderAsync.pending , (state)=>{
          state.status ="loading"
          state.isOrderPlaced = false
        })
        .addCase(createOrderAsync.fulfilled , (state , action)=>{
            state.status = "idle"
            console.log({action})
            state.currentOrder.orderId = action.payload.data.orderId
            state.currentOrder.isOrderPlaced = true
            console.log('order',{action})
        })
        .addCase(createOrderAsync.rejected , (state , action)=>{
            state.status ="idle"
            console.log({action})
        })

      // fetch all orders
        .addCase(fetchUserOrdersAsync.pending , (state)=>{
            state.status ="loading"
        })
        .addCase(fetchUserOrdersAsync.fulfilled , (state , action)=>{
            state.status ="idle"
            console.log('orderDetails',{action})
            state.orders = action.payload.data
        })
        .addCase(fetchUserOrdersAsync.rejected , (state , action)=>{
            state.status ="idle"
            state.error = action
            console.log({action})
        })
    }
})

export const selectCurrentOrderDetails = (state) => state.order.currentOrder
export const selectOrdersList = state => state.order.ordersList
export const selectOrderPlacedStatus = state => state.order.status

export const {resetCurrentOrderStatus} = orderSlice.actions 
export default orderSlice.reducer;
