import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectLoggedInUser } from '../AuthSlice';
import Cookies from "js-cookie"

export const PublicRoute = ({ children }) => {
console.log("COOKIES",Cookies.get())
    if (Cookies.get("loggedInUserInfo")) {
        return <Navigate to="/"></Navigate>;
    }
    
    return children;
};

