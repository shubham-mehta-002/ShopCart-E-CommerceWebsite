import axios from 'axios'
import {BASE_URL ,ITEMS_PER_PAGE} from '../../constants'
import { successMessageToastNotificaton , errorMessageToastNotificaton} from "../../utils/toastNotifications"


export function fetchAllProducts({filter,sort,page,searchParameter}){
    console.log('api',{searchParameter})
    console.log('ss',{sort})
    let queryString = ""
    // filters={ category:['a','b'] , brands:['c','d'] }
    queryString+=`page=${page}&limit=${ITEMS_PER_PAGE}&`
    const {category , brand} = filter
    if(category.length> 0 ){
        category.forEach(categoryValue => {
            queryString+=`category=${categoryValue}&`
        })
    }

    if(brand.length> 0 ){
        brand.forEach(brandValue => {
            queryString+=`brand=${brandValue}&`
        })
    }

    if(sort){
        queryString+=`_sort=${sort._sort}&_order=${sort._order==="asc" ? 1 :-1}& `
    }


    queryString = queryString.slice(0, -1);   
    console.log({queryString})
    

    return new Promise(async (resolve,reject) => {
        try {
            const response = await axios.post(`${BASE_URL}/products?${queryString}`,{
                search : searchParameter
            });
            // console.log('api ',{response:response})
            resolve( response.data.data);
        } catch (error) {
          errorMessageToastNotificaton()
            // console.log('api',{error})
            reject(error.message)
        }
      });   
}


export function fetchProductsByFilter({filter,pagination}){
    // {_page:1,_limit:10}
    let queryString =''
  
    for (let key in filter) {
        filter[key].forEach(value => {
            if(value !== undefined)
                queryString += `${key}=${value}&`;
        });
      }

      for(let key in pagination){
        queryString+=`${key}=${pagination[key]}&`
      }

      queryString = queryString.slice(0, -1);   

    return new Promise(async (resolve,reject) => {
        try {
            const response = await fetch(`http://localhost:8000/products?${queryString}`);
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            console.log({error})
          errorMessageToastNotificaton()

            reject(error.message)
        }
      });   
}

export function fetchAllCategories(){
    return new Promise(async (resolve,reject) => {
        try {
            const response = await axios.get(`${BASE_URL}/category`);
            resolve( response );
        } catch (error) {
          errorMessageToastNotificaton("Couldn't fetch categories")

            reject(error.message)
        }
      });   
}

export function fetchAllBrands(){
    return new Promise(async (resolve,reject) => {
        try {
            const response = await axios.get(`${BASE_URL}/brand`);
            resolve( response );
        } catch (error) {
            errorMessageToastNotificaton("Couldn't fetch Brands")
            reject(error.message)
        }
      });   
}



