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
  const [addOrDeleteProductStatus, setAddOrDeleteProductStatus] = useState(false);
  const [isDeleted, setIsDeleted] = useState(deleted);

  const editProductHandler = (e) => {
    e.preventDefault();
    navigate(`/admin/product/${_id}`);
  };

  const user = useSelector(selectLoggedInUser);

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
    const fieldsToBeUpdated = { deleted: !isDeleted };
    const response = await dispatch(updateProductAsync({ _id, fieldsToBeUpdated, navigate }));
    if (response?.payload?.data?.statusCode === 200) {
      setIsDeleted((prev) => !prev);
    }
    setAddOrDeleteProductStatus(false);
  };

  function handleAddOrRemoveFromWishlist(e) {
    e.stopPropagation();
    e.preventDefault();
    if (isProductInWishlist) {
      dispatch(removeFromWishlistAsync({ productId: _id, navigate }));
    } else {
      dispatch(addToWishlistAsync({ productId: _id, navigate }));
    }
  }

  function clickHandler() {
    navigate(`/products/${_id}`);
  }

  const discountedPrice = Math.floor(((100 - discountPercentage) / 100) * price);

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      {/* image */}
      <div className="w-full aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          onClick={clickHandler}
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
        />
      </div>

      {/* content */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        {/* brand + wishlist */}
        <div className="flex items-start justify-between gap-1">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate text-gray-900">{brand}</div>
            <div className="text-xs text-gray-500 truncate">{title}</div>
          </div>
          {user && user.role !== "admin" && (
            <button
              onClick={handleAddOrRemoveFromWishlist}
              className="flex-shrink-0 mt-0.5 ml-1"
            >
              <img
                src={
                  !isProductInWishlist
                    ? "https://img.icons8.com/?size=100&id=87&format=png&color=000000"
                    : "https://img.icons8.com/?size=100&id=7697&format=png&color=3056d3"
                }
                className="h-5 w-5 hover:cursor-pointer"
                alt="wishlist"
              />
            </button>
          )}
        </div>

        {/* price */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-sm font-bold text-gray-900">${discountedPrice}</span>
          <span className="text-xs text-gray-400"><strike>${price}</strike></span>
          <span className="text-xs font-medium text-[#4F46E5]">{discountPercentage}% OFF</span>
        </div>

        {/* stock / deleted */}
        {stock === 0 && (
          <p className="text-xs font-semibold text-red-500">Out of stock</p>
        )}
        {user?.role === "admin" && isDeleted && (
          <span className="text-xs text-red-400">deleted</span>
        )}

        {/* admin buttons */}
        {user && user.role === "admin" && (
          <div className="flex gap-2 mt-1">
            <button
              className="flex-1 bg-[#4F46E5] hover:bg-[#6366F1] rounded-md text-white text-xs font-semibold py-1.5 transition-colors"
              onClick={editProductHandler}
            >
              Edit
            </button>
            <button
              className="flex-1 bg-[#4F46E5] hover:bg-[#6366F1] rounded-md text-white text-xs font-semibold py-1.5 transition-colors"
              onClick={ProductStatusHandler}
            >
              {addOrDeleteProductStatus
                ? isDeleted ? "Adding" : "Deleting"
                : isDeleted ? "Add" : "Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
