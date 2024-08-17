import axios from "axios";
import { BASE_URL } from "../../constants";
import {
  successMessageToastNotificaton,
  errorMessageToastNotificaton,
} from "../../utils/toastNotifications";

export const fetchAllCartItems = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/cart`, {
        withCredentials: true,
      });
      resolve(response.data);
    } catch (error) {
      console.log("error while fetching cart items", { error });
      if (error.response.data.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const addItemToCart = (productDetails,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/add`,
        {
          productDetails,
        },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);
    } catch (error) {
      console.log("error while adding item to cart", { error });
      if (error.response.data.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      } else if (error.response.data.message === "Max 5 allowed") {
        errorMessageToastNotificaton("Max quantity Allowed: 5");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const reduceCartItemQuantity = (productDetails,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/reduce`,
        {
          productDetails,
        },
        { withCredentials: true }
      );
      resolve(response.data);
    } catch (error) {
      console.log("error while reducing item quantity", { error });
      if (error.response.data.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
        navigate("/login")
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const removeCartItem = (productDetails,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/cart/remove`,
        {
          productDetails,
        },
        { withCredentials: true }
      );
      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);
    } catch (error) {
      console.log("error while removing item from cart", { error });
      if (error.response.data.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
        navigate("/login")
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};
