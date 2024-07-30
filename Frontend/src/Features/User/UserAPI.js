import axios from "axios";
import { BASE_URL } from "../../constants";
import {
  successMessageToastNotificaton,
  errorMessageToastNotificaton,
} from "../../utils/toastNotifications";

export const fetchUserOrders = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/my`, {
        withCredentials: true,
      });

      resolve(response.data);
    } catch (error) {
      console.log("error while fetching user orders", { error });
      if (error.response.data.error.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const fetchUserDetails = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/my`, {
        withCredentials: true,
      });

      resolve(response.data);
    } catch (error) {
      console.log("error while fetching user details", { error });
      if (error.response.data.error.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};

export const updateUserDetails = (newData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/user/update`,
        { newData },
        { withCredentials: true }
      );

      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve({ data: response.data, newData });
    } catch (error) {
      console.log("error while updating user details", { error });
      if (error.response.data.error.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
      } else {
        errorMessageToastNotificaton();
      }
      reject(error.message);
    }
  });
};
