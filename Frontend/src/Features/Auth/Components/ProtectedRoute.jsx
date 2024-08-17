import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export function ProtectedRoute({ children }) {


  if (!Cookies.get("loggedInUserInfo")) {
      console.log("DA")
    return <Navigate to="/login"></Navigate>;
  }

  return children;
}
