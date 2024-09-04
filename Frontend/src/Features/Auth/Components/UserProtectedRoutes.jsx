import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export function UserProtectedRotues({ children }) {

  console.log(Cookies.get("loggedInUserInfo"))
  if (!Cookies.get("loggedInUserInfo") ) {
    return <Navigate to="/login"></Navigate>;
  }

  // if admin tries to access user only routes like : cart,wishlist ,etc
  if(JSON.parse(Cookies.get("loggedInUserInfo")).role==='admin'){
    console.log("SDASDASDASDSAD",JSON.parse(Cookies.get("loggedInUserInfo")).role!=='admin')
    return <Navigate to="/products"></Navigate>;
  } 

  return children;
}
