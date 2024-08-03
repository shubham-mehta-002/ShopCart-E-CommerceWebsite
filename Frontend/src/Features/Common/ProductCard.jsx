import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { updateProductAsync } from "../ProductDetail/ProductDetailSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import { useNavigate } from "react-router-dom";
import {
  selectWishlistItems,
  removeFromWishlistAsync,
  addToWishlistAsync,
} from "../Wishlist/WishlistSlice";

export function ProductCard({
  _id,
  thumbnail,
  title,
  brand,
  discountPercentage,
  stock,
  price,
  deleted,
}) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addOrDeleteProductStatus, setAddOrDeleteProductStatus] =
    useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const editProductHandler = (e) => {
    e.preventDefault();
    navigate(`/admin/product/${_id}`);
  };

  const user = useSelector(selectLoggedInUser);

  // check if product is in wishlist
  let wishlistItems = null;
  let isProductInWishlist = false;

  if (user && user.role !== "admin") {
    wishlistItems = useSelector(selectWishlistItems);
    if (wishlistItems.length > 0) {
      isProductInWishlist = wishlistItems.find(
        (item) => item._id.toString() === _id.toString()
      );
    }
  }

  const ProductStatusHandler = async (e) => {
    e.preventDefault();
    setAddOrDeleteProductStatus(true);
    const fieldsToBeUpdated = {
      deleted: !isDeleted,
    };
    const response = await dispatch(updateProductAsync({ _id, fieldsToBeUpdated }));
    if(response?.payload?.data?.statusCode === 200){
      setIsDeleted((prev) => !prev);
    }
    setAddOrDeleteProductStatus(false);
  };

  function handleAddOrRemoveFromWishlist(e) {
    e.stopPropagation();
    e.preventDefault();
    if (isProductInWishlist) {
      dispatch(removeFromWishlistAsync({ productId: _id ,navigate}));
    } else {
      dispatch(addToWishlistAsync({ productId: _id ,navigate}));
    }
  }

  function clickHandler(){
    navigate(`/products/${_id}`)
  }

  return (
    <div
      className={`text-black px-2 py-1 border-2 border-[#E5E7EB] border-solid box-border flex flex-col justify-between  w-[40vw] md:w-72 `}
    >
      <div className="content-wrapper flex flex-col my-1 h-[250px] justify-between">
        <div className="image-wrapper h-[70%]">
          <img
            onClick={clickHandler}
            src={thumbnail}
            alt={title}
            className="hover:cursor-pointer h-full w-full rounded-md bg-[#ccced2] hover:bg-[#CDD1D7]"
          />
        </div>

        <div className="product-details h-[100px] flex flex-row">
          <div className="details w-[85%]">
            <div className="brand text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {brand}
            </div>
            <div className="title text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </div>
          </div>

          {user && user.role !== "admin" && (
            <div
              className="price w-[15%] flex items-center justify-center"
              onClick={handleAddOrRemoveFromWishlist}
            >
              <img
                src={
                  !isProductInWishlist
                    ? "https://img.icons8.com/?size=100&id=87&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=7697&format=png&color=3056d3"
                }
                className="text-red-600 h-8 w-8 hover:cursor-pointer"
                alt="wishlistIcon"
              />
            </div>
          )}
        </div>

        <div className="price h-[50px] whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="text-sm font-bold">
            ${Math.floor(((100 - discountPercentage) / 100) * price)}
          </span>
          <span className="text-sm font-semibold ml-2 text-[#949596]">
            $<strike>{price}</strike>
          </span>
          <span className="text-sm font-semibold ml-1 text-[#5a65e4]">
            ({discountPercentage}% OFF)
          </span>
        </div>
      </div>

      
        
        {user && user.role === "admin" && (
          <div className="button-wrapper h-[15%] flex flex-col sm:flex-row justify-between mt-2">
            <button
              className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
              onClick={(e) => editProductHandler(e)}
            >
              Edit
            </button>

            <button
              className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
              onClick={(e) => ProductStatusHandler(e)}
            >
              {addOrDeleteProductStatus
                ? isDeleted
                  ? "Adding"
                  : "Deleting"
                : isDeleted
                ? "Add"
                : "Delete"}
            </button>
          </div>
        )}
          <div className="h-[5%] text-sm font-semibold text-red-600 flex justify-between">
            
              {stock ===0 && <p className="text-sm text-red-600">Out of stock</p>}
            
            {user && user.role === "admin" &&  isDeleted ? "deleted" : ""}
          </div>
        
      </div>
  );



}
