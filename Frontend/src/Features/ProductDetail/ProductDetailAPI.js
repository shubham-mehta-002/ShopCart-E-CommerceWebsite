import { BASE_URL } from "../../constants";
import axios from "axios";
import {
  successMessageToastNotificaton,
  errorMessageToastNotificaton,
} from "../../utils/toastNotifications";

export function fetchProductDetailById(productId) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/products/${productId}`, {
        params: {
          productId,
        },
      });
      resolve(response.data.data);
    } catch (error) {
      errorMessageToastNotificaton();
      reject(error.message);
    }
  });
}

export function updateProduct(_id, fieldsToBeUpdated,navigate) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/products/update/${_id}`,
        {
          fieldsToBeUpdated,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response);
    } catch (error) {
      console.log({ error });

      if (error?.response?.data?.statusCode === 401) {
        errorMessageToastNotificaton("Unauthorized");
        navigate("/login")
      } else {
        errorMessageToastNotificaton();
      }

      reject(error.message);
    }
  });
}
