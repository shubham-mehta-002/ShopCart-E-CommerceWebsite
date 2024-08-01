import { ProductTile } from "../../Features";
import { CheckoutButton } from "../../Features";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllCartItemsAsync } from "./CartSlice";
import { useEffect } from "react";
import { selectCartState } from "./CartSlice";

export function Cart() {
  const dispatch = useDispatch();
  const state = useSelector(selectCartState);
  
  useEffect(() => {
    dispatch(fetchAllCartItemsAsync());
  }, []);

  return (
    <div className="wrapper w-full sm:w-[90%] p-3 sm:p-10 box-border mx-auto my-10 bg-white flex flex-col gap-4">
      <div className="header text-5xl font-bold">Cart</div>

      {/* cart items */}
      <div className="cart-items-wrapper flex flex-col gap-3">
        {state?.cartItems?.length === 0 ? (
          <>
            <div className=" text-3xl my-10 font-bold flex items-center justify-center">
              No Items Added
            </div>
            <div className="flex items-center justify-center">
              <span className=" font-semibold text-center text-lg text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/products">Continue Shopping</Link>
              </span>
            </div>
          </>
        ) : (
          state?.cartItems?.map((item) => (
            <ProductTile key={uuid()} {...item} />
          ))
        )}
      </div>

      {/* price and checkout section */}
      {state?.cartItems?.length > 0 && (
        <div className="totalPrice flex flex-col gap-3">
          {/* price */}
          <div className="subTotal flex justify-between items-center">
            <span className="font-semibold text-base">Subtotal</span>
            <span className="font-semibold text-base">
              $
              {state?.cartItems?.reduce((acc, curr) => {
                return (acc +=
                  Math.floor(
                    ((100 - curr.product.discountPercentage) / 100) *
                      curr.product.price
                  ) * curr.quantity);
              }, 0)}
            </span>
          </div>
          <div className="subTotal flex justify-between items-center">
            <span className="font-semibold text-base">Total Items in Cart</span>
            <span className="font-semibold text-base">
              {state?.cartItems?.reduce((acc, curr) => {
                return (acc += curr.quantity);
              }, 0)}{" "}
              items
            </span>
          </div>
          <div className=" text-[#6B7280] text-sm">
            Shipping and taxes calculated at checkout
          </div>

          {/* checkout    */}
          <div className="mt-2 flex justify-end">
          <Link to="/checkout">
            <CheckoutButton/>
          </Link>
          </div>
          <div className="mt-4 flex items-center justify-center">
            <span className=" text-center text-lg text-gray-500">
              or 
            </span>

            <span className=" font-semibold text-center text-lg text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
              <Link to="/products">Continue Shopping</Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
