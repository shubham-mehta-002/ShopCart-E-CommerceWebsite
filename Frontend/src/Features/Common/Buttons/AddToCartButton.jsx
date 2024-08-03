import { FaShoppingBag } from "react-icons/fa";

export function AddToCartButton({message="Add to Cart"}) {
  return (
    <>
      <div className="cart">
        <button className="h-10 w-full px-10 py-6 flex items-center justify-center rounded-md border-2 border-gray-400 font-semibold text-lg text-[#3b3b3b] bg-[white]">
        <FaShoppingBag  className="mr-2" /> {message}
        </button>
      </div>
    </>
  );
}
