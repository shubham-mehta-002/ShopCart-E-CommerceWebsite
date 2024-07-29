import axios from 'axios'
import {BASE_URL} from '../../constants'
import { successMessageToastNotificaton , errorMessageToastNotificaton} from "../../utils/toastNotifications"

export const fetchAllCartItems = ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.get(`${BASE_URL}/cart`,{withCredentials:true})
            console.log({response})
            resolve(response.data)
        }catch(error){
            console.log({error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
    
}

export const addItemToCart = (productDetails) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.post(`${BASE_URL}/cart/add`,{
                productDetails
            },{withCredentials:true})
            if (response.data.success === true) {
                successMessageToastNotificaton(response.data.message);
              }
            console.log("addToCartAPI",{response})
            resolve(response.data)
        }catch(error){
            console.log("addToCartAPI",{error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else if(error.response.data.message === "Max 5 allowed"){
                errorMessageToastNotificaton("Max quantity Allowed: 5")
              }
              else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
}

export const reduceCartItemQuantity = (productDetails) =>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.post(`${BASE_URL}/cart/reduce`,{
                productDetails
            },{withCredentials:true})
            console.log("reduceCartItemQuantity",{response})
            resolve(response.data)
        }catch(error){
            console.log("reduceCartItemQuantity",{error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
}

export const removeCartItem = (productDetails) =>{
    console.log({productDetails})
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.post(`${BASE_URL}/cart/remove`,{
                productDetails
            },{withCredentials:true})
            if (response.data.success === true) {
                successMessageToastNotificaton(response.data.message);
              }
            console.log({response})
            resolve(response.data)
        }catch(error){
            console.log({error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
}



// export const addCartItemQuantity = (productId) =>{
//     return new Promise(async(resolve,reject)=>{
//         try{
//             const response = await axios.post(`${BASE_URL}/cart/add`,{
//                 productId
//             },{withCredentials:true})
//             resolve(response.data)
//         }catch(error){
//             reject(error.message)
//         }
//     })
// }