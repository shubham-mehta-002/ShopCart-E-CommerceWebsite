import axios from "axios";
import { BASE_URL, ITEMS_PER_PAGE } from "../../constants";
import { successMessageToastNotificaton , errorMessageToastNotificaton } from "../../utils/toastNotifications";

export function fetchAllProducts({ filter, sort, page, searchParameter ,admin}) {
  let queryString = "";

  queryString += `page=${page}&limit=${ITEMS_PER_PAGE}&`;

  const { category, brand } = filter;

  if (category.length > 0) {
    category.forEach((categoryValue) => {
      queryString += `category=${categoryValue}&`;
    });
  }

  if (brand.length > 0) {
    brand.forEach((brandValue) => {
      queryString += `brand=${brandValue}&`;
    });
  }

  if(admin){
   
    queryString += `admin=true&`;
  }

  if (sort) {
    queryString += `_sort=${sort._sort}&_order=${
      sort._order === "asc" ? 1 : -1
    }& `;
  }

  if(searchParameter){
    queryString += `search=${searchParameter}&`
  }

  queryString = queryString.slice(0, -1);
console.log(`${BASE_URL}/products?${queryString}`)
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/products?${queryString}`);
      resolve(response.data.data);
    } catch (error) {
      errorMessageToastNotificaton();
      reject(error.message);
    }
  });
}

export function fetchAllCategories() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/category`);
      resolve(response);
    } catch (error) {
      errorMessageToastNotificaton("Couldn't fetch categories");

      reject(error.message);
    }
  });
}

export function fetchAllBrands() {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get(`${BASE_URL}/brand`);
      resolve(response);
    } catch (error) {
      errorMessageToastNotificaton("Couldn't fetch Brands");
      reject(error.message);
    }
  });
}

export const addBrand = (label,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/brand/add`,
        {
          label,
        },
        { withCredentials: true }
      );
      if(response.data.success === true){
        console.log({response})
        successMessageToastNotificaton(response.data.message)
      } 
      resolve(response.data);
    } catch (error) {
      console.log("error while adding brand",{ error });
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

export const addCategory = (label,navigate) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/category/add`,
        {
          label,
        },
        { withCredentials: true }
      );
      if(response.data.success === true){
        console.log({response})
        successMessageToastNotificaton(response.data.message)
      } 
      resolve(response.data);
    } catch (error) {
      console.log("error while adding category",{ error });
      if(error.response.data.statusCode === 401){
        errorMessageToastNotificaton("Unauthorized")
        navigate("/login")
      }else if(error.response.data.statusCode === 409){
        errorMessageToastNotificaton("Already exists")
      }else{
      errorMessageToastNotificaton()
      }

      reject(error.message);
    }
  });
};
