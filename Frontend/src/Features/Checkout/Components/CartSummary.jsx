import { ProductTile } from "../../Common/ProductTile";
import { Link } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { fetchAllCartItemsAsync } from "../../Cart/CartSlice";
import { useEffect } from "react";
import { selectCartState } from "../../Cart/CartSlice";
import { createOrderAsync } from "../CheckoutSlice";
import { useNavigate } from "react-router-dom";
import {
  selectCurrentOrderDetails,
  selectOrderPlacedStatus,
} from "../CheckoutSlice";

export function CartSummary({ selectedAddressIndex, paymentMethod, watch }) {
  const dispatch = useDispatch();
  const cartState = useSelector(selectCartState);
  const orderStatus = useSelector(selectOrderPlacedStatus);
  const { orderId, isOrderPlaced } = useSelector(selectCurrentOrderDetails);
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchAllCartItemsAsync());
  }, [dispatch]);

  const validateFullName = (fullName) => {
    if (!fullName || fullName.trim() === "") {
      return "Full Name is required";
    }
    if (!/^[A-Za-z ]+$/.test(fullName)) {
      return "Enter a valid name";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return "Invalid email format";
    }
    return null;
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.trim() === "") {
      return "Phone number is required";
    }
    if (!/^[0-9]{10}$/.test(phoneNumber)) {
      return "Enter a valid 10-digit phone number";
    }
    return null;
  };

  function createOrderHandler() {
    setValidationError("");
    if (selectedAddressIndex === null) {
      setValidationError("Please select a delivery address.");
      return;
    }

    const fullName = watch("fullName");
    const email = watch("email");
    const phoneNumber = watch("phone");

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneNumberError = validatePhoneNumber(phoneNumber);

    if (fullNameError) {
      setValidationError(fullNameError);
      return;
    }
    if (emailError) {
      setValidationError(emailError);
      return;
    }
    if (phoneNumberError) {
      setValidationError(phoneNumberError);
      return;
    }

    const orderDetails = {
      addressIndex: selectedAddressIndex,
      paymentMethod,
      email,
      fullName,
      phoneNumber,
    };

    dispatch(createOrderAsync({ orderDetails ,navigate}))

  }


  return (
    <>
      {isOrderPlaced && navigate(`/order-success/${orderId}`)}
      
      <div className="wrapper w-full sm:w-[90%] p-3 sm:p-10 box-border mx-auto my-10 bg-white flex flex-col gap-4">
        <div className="header text-5xl font-bold">Cart</div>

        {/* Cart items */}
        <div className="cart-items-wrapper flex flex-col gap-3">
          {cartState?.cartItems?.length === 0 ? (
            <>
              <div className="text-3xl my-10 font-bold flex items-center justify-center">
                No Items Added
              </div>
              <div className="flex items-center justify-center">
                <span className="font-semibold text-center text-lg text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                  <Link to="/products">Continue Shopping</Link>
                </span>
              </div>
            </>
          ) : (
            cartState?.cartItems?.map((item) => (
              <ProductTile key={uuid()} {...item} />
            ))
          )}
        </div>

        {/* Price and checkout section */}
        {cartState?.cartItems?.length > 0 && (
          <div className="totalPrice flex flex-col gap-3">
            {/* Price */}
            <div className="subTotal flex justify-between items-center">
              <span className="font-semibold text-base">Subtotal</span>
              <span className="font-semibold text-base">
                $
                {cartState?.cartItems?.reduce((acc, curr) => {
                  return (acc +=
                    Math.floor(
                      ((100 - curr.product.discountPercentage) / 100) *
                        curr.product.price
                    ) * curr.quantity);
                }, 0)}
              </span>
            </div>
            <div className="subTotal flex justify-between items-center">
              <span className="font-semibold text-base">
                Total Items in Cart
              </span>
              <span className="font-semibold text-base">
                {cartState?.cartItems?.reduce((acc, curr) => {
                  return (acc += curr.quantity);
                }, 0)}{" "}
                items
              </span>
            </div>
            <div className="text-[#6B7280] text-sm">
              Shipping and taxes calculated at checkout
            </div>

            {/* Order now */}
            <Link to="/checkout">
              <div className="checkout">
                <button
                  disabled={orderStatus === "loading"}
                  className="h-8 w-full px-3 py-5 flex items-center justify-center rounded-md border-2 border-gray-400 font-semibold text-lg text-white bg-[#4338CA] disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={createOrderHandler}
                >
                  {orderStatus === "loading" ? "Ordering..." : "Order Now"}
                </button>
              </div>
            </Link>
            {validationError && (
              <p className="text-red-500 text-sm -mt-1">{validationError}</p>
            )}
            <div className="flex items-center justify-center">
              <span className="text-center text-sm text-gray-500 hover:cursor-pointer">
                or
              </span>

              <span className="font-semibold text-center text-sm text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/products">Continue Shopping</Link>
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
