import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../../constants";
import { successMessageToastNotificaton , errorMessageToastNotificaton} from "../../utils/toastNotifications";

export const fetchAllOrders = ({sort,page=1,navigate}) => {

  let queryString = ""

  // pagination
  queryString += `page=${page}&limit=${ITEMS_PER_PAGE}&`

  // sorting
  if(sort){
    queryString += `_sort=${sort._sort}&_order=${sort._order === "asc" ? 1 : -1}&`
  }

  queryString = queryString.slice(0,-1)
    
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/all?${queryString}`, {
        withCredentials: true,
      });
      resolve(response.data);

    } catch (error) {
      console.log("error whiile fetching all orders",{ error });

      if(error.response.data.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      }else{
      errorMessageToastNotificaton()
      }
      reject(error.message);
    }
  });
};

export const fetchOrderById = (orderId ,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        withCredentials: true,
      });
      resolve(response.data);
    } catch (error) {
      console.log("error while fetching order details ",{ error });
      if(error.response.data.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      }else{
      errorMessageToastNotificaton()
      }
      
      reject(error.message);
    }
  });
};

export const updateOrderById = ({ orderId, updatedOrderDetails ,navigate}) => {

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/orders/update/${orderId}`,
        {
          updatedOrderDetails,
        },
        { withCredentials: true }
      );

      if(response.data.success === true){
        successMessageToastNotificaton(response.data.message)
      }

      resolve(response.data);
    } catch (error) {
      console.log("error while updaing order details",{error})
      if(error.response.data.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      }else{
      errorMessageToastNotificaton()
      }
      reject(error.message);
    }
  });
};

export const createProduct = (product,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/products/create`,
        {
          product,
        },
        { withCredentials: true }
      );
      if(response.data.success === true){
        successMessageToastNotificaton(response.data.message)
      }
      resolve(response.data);
    } catch (error) {
      console.log("error while creating product",{ error });
      if(error.response.data.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      }else{
      errorMessageToastNotificaton()
      }

      reject(error.message);
    }
  });
};

