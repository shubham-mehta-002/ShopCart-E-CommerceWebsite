import { Navbar } from "../Features"
import { Outlet } from "react-router-dom"
import {useState , useEffect} from "react"
import {useSelector ,  useDispatch} from "react-redux"
import {setLoggedInUserState} from "../Features/Auth/AuthSlice"
import Cookies from "js-cookie"
import {selectWishlistItems ,fetchAllWishlistItemsAsync} from "../Features/Wishlist/WishlistSlice"

export function RootPage(){
  const [searchParameter , setSearchParameter] = useState("")

  const dispatch = useDispatch()

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
    if(userDetails){
      dispatch(fetchAllWishlistItemsAsync());
    }
  },[dispatch , userDetails])


  return(
      <div className="min-h-screen">
          <Navbar searchParameter={searchParameter} setSearchParameter={setSearchParameter}/>

          <Outlet/>
      </div>
    )
}