import axios from 'axios'
import {BASE_URL} from '../../constants'
import { successMessageToastNotificaton , errorMessageToastNotificaton} from "../../utils/toastNotifications"

export const fetchUserDetails = ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.get(`${BASE_URL}/orders`,{withCredentials:true})
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



export const addUserAddress = (addressDetails)=>{
    console.log("chech checb kar babyeo",addressDetails)
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.post(`${BASE_URL}/user/address/add`,{
                addressDetails
            },{withCredentials:true})
            if (response.data.success === true) {
                successMessageToastNotificaton(response.data.message);
            }
            console.log("add address api",{response})
            resolve(response)
        }catch(error){
            console.log("add address api",{error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
}


export const createOrder = (orderDetails)=>{
    console.log("order create ho rha hai babyo ",orderDetails)
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.post(`${BASE_URL}/orders/create`,{
                orderDetails
            },{withCredentials:true})
            if (response.data.success === true) {
                successMessageToastNotificaton(response.data.message);
            }
            console.log("create order api",{response})
            resolve(response)
        }catch(error){
            console.log("create order api",{error})
            if(error.response.data.error.statusCode === 401){
                errorMessageToastNotificaton("Unauthorized")
              }else if(error.response.data.message.includes("Insufficient stock")){
              errorMessageToastNotificaton(error.response.data.message)

              }
              else{
              errorMessageToastNotificaton()
              }
            reject(error.message)
        }
    })
}

export const fetchUserOrders = ()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            const response = await axios.get(`${BASE_URL}/user/orders`,{},
                {withCredentials:true})
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

