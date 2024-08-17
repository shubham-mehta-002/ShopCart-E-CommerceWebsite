import { Navbar } from "../Features"
import { Navigate, Outlet } from "react-router-dom"
import {useState , useEffect} from "react"
import {useSelector ,  useDispatch} from "react-redux"
import {setLoggedInUserState} from "../Features/Auth/AuthSlice"
import Cookies from "js-cookie"
import {selectWishlistItems ,fetchAllWishlistItemsAsync} from "../Features/Wishlist/WishlistSlice"
import { useNavigate } from "react-router-dom"
export function RootPage(){
  const [searchParameter , setSearchParameter] = useState("")

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // set login state
  let userDetails = null
  useEffect(()=>{
    const user = Cookies.get("loggedInUserInfo")
    if(user){
      userDetails = JSON.parse(user)
      dispatch(setLoggedInUserState(userDetails))
    }
  
  },[])

  // set wishlisted items state
  const wishlistItems = useSelector(selectWishlistItems);
  useEffect(()=>{
    if(userDetails && userDetails.role!=="admin"){
      dispatch(fetchAllWishlistItemsAsync({navigate}));
    }
  },[dispatch , userDetails])


  return(
      <div className="min-h-screen">
          <Navbar searchParameter={searchParameter} setSearchParameter={setSearchParameter}/>

          <Outlet/>
      </div>
    )
}