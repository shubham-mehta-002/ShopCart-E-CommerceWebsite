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
    if(user){
      let userDetails = null
        if(user.startsWith("j:")){
          userDetails= JSON.parse(cookieValue.slice(2))
        }
        userDetails= JSON.parse(user)
        console.log({userDetails})
    dispatch(setLoggedInUserState(userDetails))

    }
    // console.log("rrooott page",{user})
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