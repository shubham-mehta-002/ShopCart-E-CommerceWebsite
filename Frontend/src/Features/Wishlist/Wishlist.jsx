import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectWishlistItems,
  fetchAllWishlistItemsAsync,
} from "./WishlistSlice";
import { removeFromWishlistAsync, selectWishlistStatus } from "./WishlistSlice";
import { Loader } from "../../utils/Loader";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid"

export function Wishlist() {

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const wishlistItems = useSelector(selectWishlistItems);
  const status = useSelector(selectWishlistStatus);

  useEffect(() => {
    dispatch(fetchAllWishlistItemsAsync({ navigate }));
  }, [dispatch]);

  return (
    <div className="wrapper w-full sm:w-[90%] p-5 mx-auto my-10 bg-gray-50 shadow-lg rounded-xl">
      {/* Header */}
      <div className="header text-center mb-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text leading-tight tracking-wide drop-shadow-lg">
          My Wishlist
        </h1>

      </div>

      {/* Wishlist Items */}
      <div className="wishlist-items-wrapper">
        {status === "loading" ? (
          <Loader />
        ) : wishlistItems.length === 0 ? (
          <div className="text-center my-10">
            <p className="text-xl font-semibold text-gray-600">
              Seems like you didn't add anything yet!
            </p>
            <Link
              to="/products"
              className="mt-4 inline-block bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Continue Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product) => (
              <WishlistItemCard key={uuid()} {...product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function WishlistItemCard({
  _id,
  className,
  thumbnail,
  title,
  brand,
  discountPercentage,
  price,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function removeButtonClickHandler(e) {
    e.stopPropagation();
    dispatch(removeFromWishlistAsync({ productId: _id, navigate }));
  }

  return (
    <div
      onClick={() => navigate(`/products/${_id}`)}
      className={`p-4 bg-white rounded-lg shadow-md transition hover:shadow-lg hover:scale-105 ${className}`}
    >
      {/* Thumbnail */}
      <div className="relative h-40 flex justify-center items-center mb-4">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-auto object-contain rounded-md"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-500">{brand}</div>
        <div className="text-lg font-semibold text-gray-800 truncate">
          {title}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-indigo-600">
            ${Math.floor(((100 - discountPercentage) / 100) * price)}
          </span>
          <span className="text-sm text-gray-400 line-through">${price}</span>
          <span className="text-sm text-green-600">
            ({discountPercentage}% OFF)
          </span>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={(e) => removeButtonClickHandler(e)}
        className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
      >
        Remove
      </button>
    </div>
  );
}