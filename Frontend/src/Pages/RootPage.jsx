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
  useEffect(()=>{
    const user = Cookies.get("loggedInUserInfo")
    console.log({cookie : user})
    if(user){
      let userDetails = null
        if(user.startsWith("j:")){
          console.log("starts wth j :")
          userDetails= JSON.parse(user.slice(2))
        }else{
        userDetails= JSON.parse(user)
      }
        console.log({userDetails})
    dispatch(setLoggedInUserState(userDetails))

    }
  
  },[])

  // set wishlisted items state
  const wishlistItems = useSelector(selectWishlistItems);
  console.log({wishlistItems})
  useEffect(() => {
    dispatch(fetchAllWishlistItemsAsync());
  }, [dispatch]);


  return(
      <div className="min-h-screen">
          <Navbar searchParameter={searchParameter} setSearchParameter={setSearchParameter}/>

          <Outlet/>
      </div>
    )
}