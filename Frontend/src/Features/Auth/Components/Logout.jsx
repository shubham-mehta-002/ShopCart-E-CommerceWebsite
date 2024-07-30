import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAsync } from "../AuthSlice";
import { useEffect } from "react";

export function Logout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUserAsync()); // used await so that it can naviagte after the dispatch is properly executed
    navigate("/login"); // Navigate to the login page
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null; // or any other component you want to render while logging out
}
