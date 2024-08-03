import { v4 as uuid } from "uuid";
import { CiHeart } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { BsCart } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoIosMenu } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { useEffect, useState, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setSearchParameters } from "../Product/ProductSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";

export function Navbar({ searchParameter, setSearchParameter }) {
  const [showMobileViewMenu, setShowMobileViewMenu] = useState(false); // for responsive menu
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectLoggedInUser);
  const { role } = user;
  console.log({ user });

  let directLinks = [];
  if (role === "admin") {
    directLinks = [
      { name: "Orders", link: "admin/orders" },
      { name: "Products", link: "admin/products" },
    ];
  } else {
    directLinks = [
      { name: "Orders", link: "/myOrders" },
      { name: "Products", link: "/products" },
    ];
  }

  const mobileViewMenuOption = [
    { name: "Products", link: "/products" },
    { name: "Wishlist", link: "/wishlist" },
    { name: "Cart", link: "/cart" },
  ];

  let profileOptions = [];
  if (role === "admin") {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "Orders", link: "admin/orders" },
      {
        name: user.userId ? "Logout" : "Login",
        link: user.userId ? "/logout" : "/login",
      },
    ];
  } else {
    profileOptions = [
      { name: "My Profile", link: "/myProfile" },
      { name: "My Orders", link: "/myOrders" },
      {
        name: user.userId ? "Logout" : "Login",
        link: user.userId ? "/logout" : "/login",
      },
    ];
  }

  function openProfileMenuHandler(e) {
    e.stopPropagation();
    setShowProfileOptions((prevValue) => !prevValue);
  }

  function openMobileViewMenuHandler(e) {
    e.stopPropagation();
    setShowMobileViewMenu((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      setShowMobileViewMenu(false);
      setShowProfileOptions(false);
    }

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchParameter) {
      navigate(role === "admin" ? "admin/products" : "/products");
    }
  }, [searchParameter]);

  useEffect(() => {
    dispatch(setSearchParameters(searchParameter));
  }, [searchParameter, dispatch]);

 
  return (
    <div className="navbar-wrapper flex flex-row items-center justify-center">
      <div className="navbar bg-[#3b3b3b] w-[calc(100%-20px)] mt-[10px] rounded-lg h-[70px] box-border px-5 text-white flex items-center justify-between gap-4 relative z-50">
        {/* image and links wrapper */}
        <div className="flex ">
          <div className="flex w-[30%] flex-row gap-10 items-center justify-start">
            <Link to="/">
              <div className=" image h-12 w-12 mr-2">
                <img
                  src="https://mern-ecommerce-lyart.vercel.app/ecommerce.png"
                  alt="logo"
                />
              </div>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
        <ul className="hidden md:flex gap-4 mr-5">
          {directLinks.map((link) => (
            <li key={uuid()} className="text-lg cursor-pointer ">
              <NavLink to={link.link}>{link.name}</NavLink>
            </li>
          ))}
        </ul>

        {/* search bar */}
        <input
            type="text"
            className={`h-9  sm:w-[300px] rounded-md bg-[#F3F4F6] outline-none text-black px-2 transition-transform duration-300 ease-out ${
              showSearchBar ? "translate-x-0 opacity-100" : "translate-x-[220px] opacity-0"}
               ${showSearchBar ? "block" : "hidden"}
              `}
            value={searchParameter}
            placeholder="Search by product name"
            onChange={(e) => setSearchParameter(e.target.value)}
          />
        <div
          onClick={() => setShowSearchBar((prev) => !prev)} 
          className="searchBox-wrapper flex flex-col items-center justify-center  cursor-pointer">
          <div className="search-icon border-l-1 border-[#F3F4F6] flex items-center justify-center cursor-pointer">
            <IoIosSearch className="h-6 w-6 mx-auto" />
          </div>

          <span className="text-sm">Search</span>

        </div>

        <ul className="user-links hidden md:flex md:flex-row md:gap-5 ">
          {role !== "admin" && (
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
          )}

          <div
            key={uuid()}
            className="flex flex-col items-center justify-center gap-1 cursor-pointer "
            onClick={openProfileMenuHandler}
          >
            <CiUser className="h-6 w-6 " />
            <span className="text-sm">Profile</span>
          </div>

          {/* profile dropdown menu */}
          <div
            className={`${
              showProfileOptions ? "flex" : "hidden"
            } profile-menu h-[120px] w-[200px] absolute top-[95%] right-0 z-10 bg-white  shadow-2xl rounded-md border-2 border-gray-200 flex flex-col `}
          >
            {profileOptions.map((option) => (
              <Link to={option.link}>
                <div
                  key={uuid()}
                  className=" flex h-[40px] items-center cursor-pointer text-slate-700 pl-4 text-md font-normal hover:bg-gray-200"
                >
                  {option.name}
                </div>
              </Link>
            ))}
          </div>


        </ul>

               {/* mobile view menu*/}
      <div
        className="md:hidden flex flex-col items-center justify-center gap-[2px]"
        onClick={openMobileViewMenuHandler}
      >
        {showMobileViewMenu ? (
          <RxCross1 className="h-7 w-7" />
        ) : (
          <IoIosMenu className="h-7 w-7" />
        )}
      </div>
      <ul
        className={`${
          showMobileViewMenu ? "block" : "hidden"
        } burger-menu md:hidden w-full sm:w-[40%] bg-[#1F2937] absolute top-[100%] right-0 z-100 `}
      >
        {mobileViewMenuOption.map((link) => (
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
          <Link to={option.link}>
            <div
              key={uuid()}
              className="h-7 flex items-center p-4 py-6 font-semibold"
            >
              {option.name}
            </div>
          </Link>
        ))}
      </ul>
      {/* mobile view menu  */}
        </div>

      
      </div>
    </div>
  );
}
