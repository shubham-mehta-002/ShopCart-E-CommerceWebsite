import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../../constants";
import { successMessageToastNotificaton , errorMessageToastNotificaton} from "../../utils/toastNotifications";

export const fetchAllOrders = ({sort,page=1}) => {

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
      console.log({ response });
      // if(response.data.success === true){
      //   successMessageToastNotificaton(response.data.message)
      // }
      resolve(response.data);
    } catch (error) {
      // console.log({ error });
      console.log(error.response )

      if(error.response.data.error.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
      }else{
      errorMessageToastNotificaton()
      }
      reject(error.message);
    }
  });
};

export const fetchOrderById = (orderId) => {
  // console.log("api ", { orderId });
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        withCredentials: true,
      });
      console.log({response})
      // if(response.data.success === true){
      //   successMessageToastNotificaton(response.data.message)
      // }
      resolve(response.data);
    } catch (error) {
      console.log({ error });
      errorMessageToastNotificaton()
      reject(error.message);
    }
  });
};

export const updateOrderById = ({ orderId, updatedOrderDetails }) => {
  console.log("api order update", { orderId });
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

      console.log({ error });
      console.log(error.response.data.error.statusCode )
      if(error.response.data.error.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
      }else{
      errorMessageToastNotificaton()
      }
      errorMessageToastNotificaton()
      reject(error.message);
    }
  });
};

export const createProduct = (product) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/products/create`,
        {
          product,
        },
        { withCredentials: true }
      );
      console.log("crate product ",{response})
      if(response.data.success === true){
        successMessageToastNotificaton(response.data.message)
      }
      resolve(response.data);
    } catch (error) {
      console.log({ error });
      errorMessageToastNotificaton()

      reject(error.message);
    }
  });
};
