import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {fetchUserOrders, fetchUserDetails ,updateUserDetails} from "./UserAPI"

const initialState = {
  userInfo:{}, // this is for detailed user info  
  status: "idle",
  error: null,
};

export const fetchUserOrdersAsync = createAsyncThunk(
  "user/fetchUserOrders",
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

export const fetchUserDetailsAsync = createAsyncThunk(
  "user/fetchUserDetails",
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

export const updateUserDetailsAsync = createAsyncThunk(
  "user/updateUserDetails",
  async ({newData}) => {
    try {
      console.log({newData})
      const response = await updateUserDetails(newData);
      console.log('user udpdate slic async ',{response})
      return response;
    } catch (error) {
      throw error;
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
        .addCase(fetchUserOrdersAsync.pending,(state)=>{
            state.status='loading'
        })
        .addCase(fetchUserOrdersAsync.fulfilled,(state,action)=>{
            console.log("slice user ",{action})
            state.userInfo.orders = action.payload
            state.status='idle'
        })  
        .addCase(fetchUserOrdersAsync.rejected,(state,action)=>{
            console.log("slice user error",{action})
            state.error = action.error.message
            state.status='idle'
        })          
        
      // user details
        .addCase(fetchUserDetailsAsync.pending,(state)=>{
          state.status='loading'
        })
        .addCase(fetchUserDetailsAsync.fulfilled,(state,action)=>{
            console.log("user details slice",{action})
            state.userInfo = action.payload
            state.status='idle'
        })  
        .addCase(fetchUserDetailsAsync.rejected,(state,action)=>{
            console.log("user details error slice",{action})
            state.error = action.error.message
            state.status='idle'
      })   
      
      // update user details
      .addCase(updateUserDetailsAsync.pending,(state)=>{
        state.status='loading'
      })
      .addCase(updateUserDetailsAsync.fulfilled,(state,action)=>{
          console.log("update user details slice",{action})
          state.userInfo = {...state.userInfo , ...action.payload.newData}
          state.status='idle'
      })  
      .addCase(updateUserDetailsAsync.rejected,(state,action)=>{
          console.log("update user details error slice",{action})
          // state.error = action.error.message
          state.status='idle'
    })
    }
})

// export const selectCurrentOrderDetails = (state) => state.order.currentOrder
export const selectUserOrderDetails = state => state.user.userInfo.orders
export const selectUserState = state => state.user


export default orderSlice.reducer;
