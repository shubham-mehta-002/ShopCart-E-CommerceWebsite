import { useSelector } from "react-redux";
import {selectLoggedInUser} from "../Auth/AuthSlice"
import { Navigate } from "react-router-dom";

export function AdminProtectedRoute ({children}){
    const {userId, role} = useSelector(selectLoggedInUser)

    if(!userId){
        return <Navigate to="/login"></Navigate>
    }
    
    if(userId && role!=="admin"){
        return <Navigate to="/"></Navigate>
    }

    return children

}