import { FaHeart } from "react-icons/fa";

export function AddToWishlistButton({message="Add To Wishlist"}) {
  return (
    <>
      <div className="cart">
        <button className="h-10 w-full px-10 py-6 flex items-center justify-center rounded-lg border-2 border-gray-400 font-semibold text-lg text-white bg-[#3b3b3b]">
        <FaHeart className="mr-2" /> {message}
        </button>
      </div>
    </>
  );
}
