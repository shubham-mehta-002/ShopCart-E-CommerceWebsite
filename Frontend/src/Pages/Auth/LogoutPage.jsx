import {Logout} from "../../Features"
import Cookies from "js-cookie"
import { Navigate } from "react-router-dom"

export function LogoutPage(){
    
    if(!Cookies.get('loggedInUserInfo') ){
        return <Navigate to="/login"></Navigate>
    }

    return(
        <Logout></Logout>
    )
}