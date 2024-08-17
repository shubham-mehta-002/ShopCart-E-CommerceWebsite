import axios from "axios";
import {
  errorMessageToastNotificaton,
  successMessageToastNotificaton,
} from "../../utils/toastNotifications";
import { BASE_URL } from "../../constants";

export const fetchAllWishlistItems = (navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/wishlist`, {
        withCredentials: true,
      });
      resolve(response.data);
    } catch (error) {
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

export const addToWishlist = (productId,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/wishlist/add`,
        {
          productId,
        },
        {
          withCredentials: true,
        }
      );
      successMessageToastNotificaton("Successfully added");
      resolve(response.data);
    } catch (error) {
      console.log({error})
      if (error.response.data?.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      } else if (error.response.data?.statusCode === 409) {
        errorMessageToastNotificaton("Already in Wishlist");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const removeFromWishlist = (productId,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/wishlist/remove`,
        {
          productId,
        },
        {
          withCredentials: true,
        }
      );
      successMessageToastNotificaton("Successfully removed");
      resolve(response.data);
    } catch (error) {
      if (error.response.data.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};
