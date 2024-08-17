import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"

export function AdminProtectedRoute ({children}){
    let userId = null
    let role =null

    console.log(Cookies.get("loggedInUserInfo"))

    if (!Cookies.get("loggedInUserInfo")) {
        console.log("naviagting")
        return <Navigate to="/login"></Navigate>;
    }else{
        userId = JSON.parse(Cookies.get("loggedInUserInfo")).userId
        role = JSON.parse(Cookies.get("loggedInUserInfo")).role
    }

    if(!userId){
        return <Navigate to="/login"></Navigate>
    }
    
    if(userId && role!=="admin"){
        return <Navigate to="/"></Navigate>
    }

    return children

}