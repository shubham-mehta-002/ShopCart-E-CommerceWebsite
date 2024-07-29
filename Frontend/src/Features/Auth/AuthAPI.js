import axios from "axios";
import {
  successMessageToastNotificaton,
  errorMessageToastNotificaton,
} from "../../utils/toastNotifications";
import { BASE_URL } from "../../constants";


export function registerUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        email,
        password,
      });

      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);
    } catch (error) {
      console.log("error in registeration api ", error.message);
      if (error.response) {
        const errorCode = error.response.status;
        if (errorCode === 409) {
          errorMessageToastNotificaton("User already exists with this email");
        } else if (errorCode === 500) {
          errorMessageToastNotificaton("Internal Server Error");
        } else {
          errorMessageToastNotificaton("Something went wrong!!");
        }
        return reject(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received like 'http://local:8000/auth' instead of localhost
        errorMessageToastNotificaton(error.message);
        reject(error.message);
      } else {
        // Something happened in setting up the request that triggered an Error like htpp instead of http
        errorMessageToastNotificaton("Something went wrong!!");
        reject(error.message);
      }
    }
  });
}


export function loginUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      },{
        withCredentials: true, // Ensure cookies are included
    })
      console.log({response})
      if (response.data.success === true) {
        // localStorage.setItem('loggedInUser', JSON.stringify({
        //   userId : response.data.data._id,
        //   role: response.data.data.role
        // }));
        
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);
    } catch (error) {
      if (error.response) {
        const errorCode = error.response.status;
        if (errorCode === 401) {
          errorMessageToastNotificaton("Invalid Credentials");
        } else if (errorCode === 500) {
          errorMessageToastNotificaton("Internal Server Error");
        } else {
          errorMessageToastNotificaton("Something went wrong!!");
        }
        return reject(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received like 'http://local:8000/auth' instead of localhost
        errorMessageToastNotificaton(error.message);
        reject(error.message);
      } else {
        // Something happened in setting up the request that triggered an Error like htpp instead of http
        errorMessageToastNotificaton("Something went wrong!!");
        reject(error.message);
      }
    }
  });
}


export function logoutUser() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/logout`,{},{
        withCredentials: true, // Ensure cookies are included
    })
      console.log({response})
      if (response.data.success === true) {
        successMessageToastNotificaton(response.data.message);
      }
      resolve(response.data);

    } catch (error) {
      Cookies.remove('loggedInUserInfo')
      if (error.response) {
        const errorCode = error.response.status;
        if(errorCode === 401){
          errorMessageToastNotificaton("Invalid request : Unauthorized");
        }
        else if (errorCode === 500) {
          errorMessageToastNotificaton("Internal Server Error");
        } else {
          errorMessageToastNotificaton("Something went wrong!!");
        }
        return reject(error.response.data.message);
      } else if (error.request) {
        // The request was made but no response was received like 'http://local:8000/auth' instead of localhost
        errorMessageToastNotificaton(error.message);
        reject(error.message);
      } else {
        // Something happened in setting up the request that triggered an Error like htpp instead of http
        errorMessageToastNotificaton("Something went wrong!!");
        reject(error.message);
      }
    }
  });
}


export function resetPasswordRequest(email) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password-request`,{
        email
      })
      console.log({response})
      if (response.data.success === true) {
        successMessageToastNotificaton("Mail Sent !! ");
      }
      resolve(response.data);

    } catch (error) {
      console.log({error})
      errorMessageToastNotificaton("Something went wrong ");
    }
  });
}

export function resetPassword({password , token , email}) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/reset-password`,{
        password,
        token,
        email
      })
      console.log({response})
      if (response.data.success === true) {
        successMessageToastNotificaton("Password Updated !! ");
      }
      resolve(response.data);

    } catch (error) {
      console.log({error})
      if(error.response.data.message === "Token Invalid"){
        errorMessageToastNotificaton("Token Invalid")
      }else{
      errorMessageToastNotificaton("Something went wrong ")
      }
    }
  });
}