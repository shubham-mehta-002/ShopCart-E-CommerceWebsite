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
import { v4 as uuid} from "uuid"

export function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const wishlistItems = useSelector(selectWishlistItems);
  const status = useSelector(selectWishlistStatus);

  useEffect(() => {
    dispatch(fetchAllWishlistItemsAsync({navigate}));
  }, [dispatch]);

  return (
    <div className="wrapper w-full sm:w-[90%] p-3 sm:p-0 box-border mx-auto my-10 bg-white flex flex-col gap-4">
      <div className="header text-5xl mb-7 font-bold">Wishlist</div>

      {/* wishlist items */}
      <div className="wishlist-items-wrapper flex flex-col gap-3 mb-10 ">
        {status === "loading" ? (
          <Loader />
        ) : wishlistItems.length === 0 ? (
          <>
            <div className="text-3xl my-10 font-bold flex items-center justify-center">
              Seems like you didn't add anything yet!
            </div>
            <div className="flex items-center justify-center">
              <span className="font-semibold text-center text-lg text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/products">Continue Exploring</Link>
              </span>
            </div>
          </>
        ) : (
          <div className="md:ml-10 flex items-center justify-center">
            <div className="products-container flex justify-start flex-wrap gap-5 sm:gap-12">
            {wishlistItems?.map((product) => (
              <WishlistItemCard
              key={uuid()}
                {...product}
                className="h-[310px] sm:h-[340px] w-40 sm:w-56"
              />
            ))}
            </div>
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
  const navigate = useNavigate()

  function removeButtonClickHandler(e) {
    e.stopPropagation();
    dispatch(removeFromWishlistAsync({ productId: _id ,navigate}));
  }

  return (
    <div
      onClick={()=>navigate(`/products/${_id}`)}
      className={`hover:cursor-pointer text-black px-2 py-1 border-2 border-[#E5E7EB] border-solid box-border ${className} flex flex-col h-full`}
    >
      <div className="content-wrapper flex flex-col h-full">
        {/* Image Section */}
        <div className="image-wrapper h-[200px] flex items-center justify-center mb-2">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full rounded-md"
          />
        </div>
  
        {/* Product Details Section */}
        <div className="product-details flex flex-col flex-grow mb-2">
          <div className="details mb-1">
            <div className="brand text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {brand}
            </div>
            <div className="title text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </div>
          </div>
  
          {/* Price Section */}
          <div className="price flex flex-row">
            <span className="text-sm font-bold">
              ${Math.floor(((100 - discountPercentage) / 100) * price)}
            </span>
            <div className="flex items-center">
              <span className="text-sm font-semibold ml-2 text-[#949596]">
                $<strike>{price}</strike>
              </span>
              <span className="text-sm font-semibold ml-1 text-[#5a65e4]">
                ({discountPercentage}% OFF)
              </span>
            </div>
          </div>
        </div>
  
        {/* Remove Button */}
        <button
          className="h-[32px] hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
          onClick={(e) => removeButtonClickHandler(e)}
        >
          Remove
        </button>
      </div>
    </div>
  );
  
}
