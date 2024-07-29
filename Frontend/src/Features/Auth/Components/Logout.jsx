import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUserAsync } from "../AuthSlice";

export function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("i ma called")

    try {
      console.log("i ma called2")

      await dispatch(logoutUserAsync());
      localStorage.removeItem("loggedInUser");
      navigate('/login'); // Navigate to the login page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Trigger the logout process immediately
  handleLogout();

  return null; // or any other component you want to render while logging out
}
