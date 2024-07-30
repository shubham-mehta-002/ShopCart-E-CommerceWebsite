import { useNavigate } from "react-router-dom";
import { useDispatch , useSelector} from "react-redux";
import { logoutUserAsync } from "../AuthSlice";
import { useEffect } from "react";
import { selectLoggedInUser } from "../AuthSlice";

export function Logout() {
  console.log(useSelector(selectLoggedInUser))
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async() => {
    console.log("i am called");

    await dispatch(logoutUserAsync());
    console.log("1.............")
      navigate('/login'); // Navigate to the login page
    console.log("2.............")

    
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return null; // or any other component you want to render while logging out
}
