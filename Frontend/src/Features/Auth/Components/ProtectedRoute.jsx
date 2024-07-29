import { useSelector } from "react-redux";
import {selectLoggedInUser} from "../AuthSlice"
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie"

export function ProtectedRoute ({children}){
    console.log(Cookies.get('loggedInUserInfo'))
    if(!Cookies.get('loggedInUserInfo') ){
        console.log("yesss..")
        return <Navigate to="/login"></Navigate>
    }

    return children
}
