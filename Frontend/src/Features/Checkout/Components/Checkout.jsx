import { CartSummary } from "./CartSummary";
import { v4 as uuid } from "uuid";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import {
  fetchUserDetailsAsync,
  addUserAddressAsync,
  selectCurrentOrderDetails,
} from "../CheckoutSlice";

export function Checkout() {
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const paymentMethods = ["Cash", "Card"];

  const {
    register: registerPersonal,
    handleSubmit: handleSubmitPersonal,
    reset: resetPersonal,
    watch: watchPersonal,
    formState: { errors: errorsPersonal },
  } = useForm();

  const {
    register: registerAddress,
    handleSubmit: handleSubmitAddress,
    reset: resetAddress,
    watch: watchAddress,
    formState: { errors: errorsAddress },
  } = useForm();

  const dispatch = useDispatch();
  const { user: userDetails } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserDetailsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (userDetails) {
      resetPersonal({
        fullName: userDetails.fullName || "",
        email: userDetails.email || "",
        phone: userDetails.phoneNumber || "",
      });
    }
  }, [userDetails, resetPersonal]);

  const validation = {
    fullName: {
      required: {
        value: true,
        message: "Full Name is required",
      },
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Enter a valid name",
      },
      validate: (fullName) => {
        if (fullName.trim() === "") return "Full Name field can't be empty";
        return true;
      },
    },
    email: {
      required: {
        value: true,
        message: "Email is required",
      },
      pattern: {
        value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        message: "Invalid email format",
      },
      validate: (email) => {
        if (email.trim() === "") return "Email field can't be empty";
        return true;
      },
    },
    phone: {
      required: {
        value: true,
        message: "Phone number is required",
      },
      pattern: {
        value: /^[0-9]{10}$/, // Ensures the phone number is exactly 10 digits
        message: "Enter a valid 10 digit phone number",
      },
      validate: {
        containsOnlyNumbers: (phone) => {
          if (!/^\d{10}$/.test(phone)) {
            return "Phone number must contain exactly 10 digits and only numbers";
          }
          return true;
        },
        nonEmpty: (phone) => {
          if (phone.trim() === "") return "Phone field can't be empty";
          return true;
        },
      },
    },
    streetAddress: {
      required: {
        value: true,
        message: "Street Address is required",
      },
      pattern: {
        value: /^[A-Za-z0-9,#. ]+$/,
        message: "Enter a valid street Address",
      },
      validate: (streetAddress) => {
        if (streetAddress.trim() === "") return "Street Address can't be empty";
        return true;
      },
    },
    city: {
      required: {
        value: true,
        message: "City is required",
      },
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Enter a valid city",
      },
      validate: (city) => {
        if (city.trim() === "") return "City field can't be empty";
        return true;
      },
    },
    state: {
      required: {
        value: true,
        message: "State is required",
      },
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Enter a valid state",
      },
      validate: (state) => {
        if (state.trim() === "") return "State field can't be empty";
        return true;
      },
    },
    pincode: {
      required: {
        value: true,
        message: "Pincode is required",
      },
      pattern: {
        value: /^\d{6}$/,
        message: "Enter a valid pincode",
      },
      validate: (pincode) => {
        if (pincode.trim() === "") return "Pincode can't be empty";
        return true;
      },
    },
  };

  const handleAddressSubmit = (data) => {
    const addressDetails = {
      street: data.streetAddress,
      city: data.city,
      state: data.state,
      pinCode: data.pincode,
    };

    dispatch(addUserAddressAsync({ addressDetails }));
    resetAddress();
  };

  const state = useSelector(selectCurrentOrderDetails);

  return (
    <div className="wrapper block lg:flex lg:flex-row lg:justify-around ">
      <div className="personal-details-wrapper  w-[100%] sm:w-[90%] mx-auto lg:w-[45%] my-10 lg:mx-4 py-4 px-8 bg-white">
        <div className="heading my-5">
          <div className="text-3xl font-bold">Personal Information</div>
          <div className="text-gray-700">
            Use a permanent address where you can receive mail.
          </div>
        </div>

        <form>
          {/* Full Name */}
          <div className="fullName mb-8 w-[90%]">
            <label htmlFor="fullName" className="font-medium text-sm">
              Full Name
            </label>
            <input
              {...registerPersonal("fullName", { ...validation.fullName })}
              type="text"
              className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
            />
            {errorsPersonal.fullName && (
              <span className="text-sm text-red-600">
                *{errorsPersonal.fullName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="email mb-8 w-[90%]">
            <label htmlFor="email" className="font-medium text-sm">
              Email Address
            </label>
            <input
              {...registerPersonal("email", { ...validation.email })}
              type="text"
              className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
            />
            {errorsPersonal.email && (
              <span className="text-sm text-red-600">
                *{errorsPersonal.email.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="phone mb-8 w-[80%]">
            <label htmlFor="phone" className="font-medium text-sm">
              Phone
            </label>
            <input
              {...registerPersonal("phone", { ...validation.phone })}
              type="text"
              className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
            />
            {errorsPersonal.phone && (
              <span className="text-sm text-red-600">
                *{errorsPersonal.phone.message}
              </span>
            )}
          </div>

          <div className="button-wrapper flex flex-row justify-end">
            <button
              className="h-5 w-20 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md"
              onClick={() => resetPersonal()}
            >
              Reset
            </button>
          </div>
        </form>

        <hr className="my-5 border-1 border-gray-600" />

        {/* form start */}
        <form onSubmit={handleSubmitAddress(handleAddressSubmit)}>
          <div className="street-address mb-8">
            <label htmlFor="streetAddress" className="font-medium text-sm">
              Street Address
            </label>
            <input
              {...registerAddress("streetAddress", {
                ...validation.streetAddress,
              })}
              type="text"
              className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
            />
            {errorsAddress.streetAddress && (
              <span className="text-sm text-red-600">
                *{errorsAddress.streetAddress.message}
              </span>
            )}
          </div>

          <div className="other-address-details lg:flex flex-row items-center justify-between">
            <div className="city w-[90%] mb-8 lg:w-[30%]">
              <label htmlFor="city" className="font-medium text-sm">
                City
              </label>
              <input
                {...registerAddress("city", { ...validation.city })}
                type="text"
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errorsAddress.city && (
                <span className="text-sm text-red-600">
                  *{errorsAddress.city.message}
                </span>
              )}
            </div>

            <div className="state w-[90%] mb-8 lg:w-[30%]">
              <label htmlFor="state" className="font-medium text-sm">
                State/Province
              </label>
              <input
                {...registerAddress("state", { ...validation.state })}
                type="text"
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errorsAddress.state && (
                <span className="text-sm text-red-600">
                  *{errorsAddress.state.message}
                </span>
              )}
            </div>

            <div className="pincode w-[90%] mb-8 lg:w-[30%]">
              <label htmlFor="pincode" className="font-medium text-sm">
                ZIP / Postal Code
              </label>
              <input
                {...registerAddress("pincode", { ...validation.pincode })}
                type="text"
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errorsAddress.pincode && (
                <span className="text-sm text-red-600">
                  *{errorsAddress.pincode.message}
                </span>
              )}
            </div>
          </div>

          <div className="button-wrapper flex flex-row justify-end">
            <button
              className="h-5 w-20 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md"
              onClick={() => resetAddress()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="h-5 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
            >
              Add Address
            </button>
          </div>
        </form>

        {/* saved address information */}
        <div className="saved-address mt-5">
          <div className="text-xl font-semibold">Addresses</div>
          {userDetails?.address?.length > 0 ? (
            <>
              <div className="text-base mb-3">
                Choose from Existing addresses
              </div>

              <ul className="flex flex-col mx-auto gap-4">
                {userDetails.address.map((address, index) => (
                  <label
                    key={uuid()}
                    className="flex gap-1 p-1 border-2 border-slate-300"
                    onClick={() => setSelectedAddressIndex(index)}
                  >
                    <input
                      type="radio"
                      name="address"
                      checked={index === selectedAddressIndex}
                    />
                    <div className="ml-3">
                      <div className="text-md font-medium">
                        {address.streetAddress}
                      </div>
                      <div>
                        {address.city}, {address.state}
                      </div>
                      <div>{address.pinCode}</div>
                    </div>
                  </label>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2">No saved addresses found</p>
          )}
        </div>

        {/* payment options*/}
        <div className="payment-options mt-10">
          <div className="text-xl font-semibold">Payment Methods</div>
          <div className="text-base mb-3">Choose One</div>

          <ul className="flex flex-col mx-auto gap-1">
            {paymentMethods &&
              paymentMethods.length &&
              paymentMethods.map((method) => (
                <label
                  onClick={() => setPaymentMethod(method)}
                  key={uuid()}
                  className="flex p-1 items-center"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <div className="ml-2">{method}</div>
                </label>
              ))}
          </ul>
        </div>

        <hr className="my-8" />
      </div>

      <div className="cart-summary w-[100%] mx-auto lg:w-[45%] my-10 ">
        <CartSummary
          selectedAddressIndex={selectedAddressIndex}
          paymentMethod={paymentMethod}
          watch={watchPersonal}
        />
      </div>
    </div>
  );
}
