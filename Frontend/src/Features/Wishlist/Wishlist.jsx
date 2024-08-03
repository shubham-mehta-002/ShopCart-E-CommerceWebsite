import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  selectWishlistItems,
  fetchAllWishlistItemsAsync,
} from "./WishlistSlice";
import { removeFromWishlistAsync, selectWishlistStatus } from "./WishlistSlice";
import { selectLoggedInUser } from "../Auth/AuthSlice";
import { Loader } from "../../utils/Loader";

export function Wishlist() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const status = useSelector(selectWishlistStatus);

  useEffect(() => {
    dispatch(fetchAllWishlistItemsAsync());
  }, [dispatch]);

  return (
    <div className="wrapper w-full sm:w-[90%] p-3 sm:p-10 box-border mx-auto my-10 bg-white flex flex-col gap-4">
      <div className="header text-5xl mb-7 font-bold">Wishlist</div>

      {/* wishlist items */}
      <div className="wishlist-items-wrapper flex flex-col gap-3">
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
          <div className="md:mx-16 products-container w-full grid grid-cols-2 vsm:grid-cols-2 xl:grid-cols-4 gap-y-5 gap-x-0  ">
            {wishlistItems?.map((product) => (
              <WishlistItemCard
                {...product}
                className="h-[300px] sm:h-[340px] sm:w-72"
              />
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
  stock,
  price,
  deleted,
}) {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  function removeButtonClickHandler(e) {
    e.stopPropagation();
    dispatch(removeFromWishlistAsync({ productId: _id }));
  }

  return (
    <div
      className={`text-black px-2 py-1 border-2 border-[#E5E7EB] border-solid box-border ${className} flex flex-col justify-between `}
    >
      <div className="content-wrapper flex flex-col my-1 h-[80%] justify-between">
        <div className="image-wrapper h-[70%]">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full rounded-md bg-[#ccced2] hover:bg-[#CDD1D7]"
          />
        </div>

        <div className="product-details h-[18%] flex flex-row">
          <div className="details w-[85%]">
            <div className="brand text-md font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
              {brand}
            </div>
            <div className="title text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </div>
          </div>
        </div>

        <div className="price h-[7%] whitespace-nowrap overflow-hidden text-ellipsis">
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

      <button
        className="hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold px-4 py-1"
        onClick={(e) => removeButtonClickHandler(e)}
      >
        Remove
      </button>
    </div>
  );
}
