import { v4 as uuid } from "uuid";
import { CiHeart } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useState , useRef} from "react";
import { NavLink, Link , useNavigate} from "react-router-dom";
import {selectProducts} from "../Product/ProductSlice"
import {useSelector , useDispatch } from "react-redux"
import {setSearchParameters} from "../Product/ProductSlice"
import {selectLoggedInUser} from "../Auth/AuthSlice"

export function Navbar({searchParameter,setSearchParameter}) {
  const [showMenu, setShowMenu] = useState(false); // for responsive menu
  const [showProfileOptions, setShowProfileOptions] = useState(false)

  const products = useSelector(selectProducts)
  const dispatch = useDispatch()

  useEffect(()=>{
    console.log({products})
    console.log({searchParameter})
    dispatch(setSearchParameters(searchParameter))

  },[searchParameter,dispatch])

  const {role} = useSelector(selectLoggedInUser)
  console.log({role})
  let directLinks = []
  if(role === "admin"){
    directLinks = [
      { name: "Orders", link: "admin/orders" },
      { name: "Products", link: "admin/products" },
    ];
  }else{
    directLinks = [
      { name: "Home", link: "/home" },
      { name: "Products", link: "/products" },
    ];
  }

   

  // const userLinks = [
  //   { icon: <CiHeart className="h-6 w-6 " />, name: "Wishlist", link: "/wishlist",},
  //   { icon: <BsCart className="h-6 w-6 " />, name: "Cart", link: "/cart" },
  //   { icon: <CiUser className="h-6 w-6" />, name: "Profile", link: "#" },
  // ]
  
  const burgerMenuOption = [
    { name: "Products", link: "/products" },
    { name: "Wishlist", link: "/wishlist" },
    { name: "Cart", link: "/cart" },
  ];

  let profileOptions=[]
  if(role === "admin"){
    profileOptions = [
      { name: "My Profile" , link : "/myProfile" },
      { name : "Orders" , link : "admin/orders"},
      { name : "Logout" , link : "/logout"}
    ]
  }else{
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "My Orders", link: "/myOrders" },
      { name: "Logout", link: "/logout" },
    ];
  }
 
  const navigate = useNavigate()
  useEffect(()=>{
    if(searchParameter){
      navigate(role==="admin" ? "admin/products" : "/products")
    }
  },[searchParameter])


  const profileMenuRef = useRef()

  function OpenProfileMenuHandler(e){
    e.stopPropagation()
    setShowProfileOptions(prevValue => !prevValue)
  }

  useEffect(()=>{
    const showProfileMenuEventHandler = window.addEventListener('click',()=>{
      setShowProfileOptions(false)
    })

    // return (()=>{
    //   // showProfileMenuEventHandler.remove()
    // })
  })

  return (
    <div className="navbar-wrapper bg-[#1F2937] w-full h-[70px] box-border px-5 text-white flex items-center justify-between relative z-50">
      
      {/* image and links wrapper */}
      <div 
        className="flex w-[30%] flex-row gap-10 items-center justify-between">
        <Link to="/home">
          <div className=" image h-12 w-12 mr-2">
            <img
              src="https://mern-ecommerce-lyart.vercel.app/ecommerce.png"
              alt="logo"
            />
          </div>
        </Link>

        <ul className="w-[calc(100%-100px)] direct-links hidden md:flex md:direction-row md:gap-4 md:justify-evenly ">
          {directLinks.map((link) => (
            <li key={uuid()} className="text-xl cursor-pointer">
              <NavLink to={link.link}>{link.name}</NavLink>
            </li>
          ))}
        </ul>
      </div>
      
          
          
      {/* search bar */}
      <div 
        className="searchBox-wrapper flex flex-row mx-4 w-[70%] md:w-[35%] ">
        <div className="search-icon h-9 w-9 border-l-1 border-l-1 border-[#F3F4F6] flex ">
          <IoIosSearch className="h-full w-full" />
        </div>
        <input
          type="text"
          className="h-9 w-full rounded-md bg-[#F3F4F6] outline-none text-black px-2"
          value={searchParameter}
          placeholder="search by product name"
          onChange = {(e)=>setSearchParameter(e.target.value)}
        />
      </div>
    

      {/* cart/wishlist/profile icons */}
      <ul className="user-links hidden md:flex md:flex-row md:gap-5 ">
        {role !== "admin" && 
        <>
        <div
          key={uuid()}
          className="flex flex-col items-center justify-center gap-1 cursor-pointer "
        >
          <Link to="/wishlist">
            <CiHeart className="h-6 w-6 mx-auto" />
            <span className="text-sm">Wishlist</span>
          </Link>
        </div>

        <div
          key={uuid()}
          className="flex flex-col items-center justify-center gap-1 cursor-pointer "
        >
          <Link to="/cart">
            <BsCart className="h-6 w-6 " />
            <span className="text-sm">Cart</span>
          </Link>
        </div>
        </>
  }

        <div
          key={uuid()}
          className="flex flex-col items-center justify-center gap-1 cursor-pointer "
          onClick={OpenProfileMenuHandler}
        >
          <CiUser className="h-6 w-6 " />
          <span className="text-sm">Profile</span>
        </div>

        {/* profile dropdown menu */}
        <div 
          className={`${showProfileOptions ? "flex" : "hidden"} profile-menu h-[120px] w-[200px] absolute top-[95%] right-0 z-10 bg-white  shadow-2xl rounded-md border-2 border-gray-200 flex flex-col `}>
            {
                profileOptions.map(option => (
                    <Link to={option.link} >
                    <div key={uuid()} className=" flex h-[40px] items-center cursor-pointer text-slate-700 pl-4 text-md font-normal hover:bg-gray-200"
                    >{option.name}</div></Link>
                ))
            }
        </div>

      </ul>


      {/* resposive menu -mobileView */}
      <div
        className="md:hidden flex flex-col items-center justify-center gap-[2px]"
        onClick={() => setShowMenu((prevValue) => !prevValue)}
      >
        {showMenu ? (
          <RxCross1 className="h-7 w-7" />
        ) : (
          <IoIosMenu className="h-7 w-7" />
        )}
      </div>
      <ul
        className={`${
          showMenu ? "block" : "hidden"
        } burger-menu md:hidden w-full sm:w-[40%] bg-[#1F2937] absolute top-[100%] right-0 z-100 `}
      >
        {burgerMenuOption.map((link) => (
            <Link to={link.link}>
          <div
            key={uuid()}
            className="h-7 flex items-center p-4 py-6 font-semibold"
          >
            {link.name}
            </div>
            </Link>

        ))}
        <hr className="text-white" />
        {profileOptions.map((option) => (
          <div
            key={uuid()}
            className="h-7 flex items-center p-4 py-6 font-semibold"
          >
            {option.name}
          </div>
        ))}
      </ul>
      {/* resposive menu -mobileView ends */}
        
    
    </div>
  );
}
