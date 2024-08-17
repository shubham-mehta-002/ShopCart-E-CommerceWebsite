import pageNotFoundImage from "../assets/404NotFound.png"
import { useNavigate } from "react-router-dom";

export function PageNotFound() {
  const navigate = useNavigate()
  return (
    <div className="h-[90vh] flex flex-col items-center gap-3 justify-center px-6">
      <img src={pageNotFoundImage} alt="404 page not found"  className="h-[40vw] sm:h-[20vw]"/>
      <p className="text-center text-2xl mx-10">We are sorry but the page you are looking for does not exist.</p>
      <span className="text-xl">Go to <span className="text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer " onClick={()=>navigate("/")}>Home</span></span>
    </div>
  );
}
