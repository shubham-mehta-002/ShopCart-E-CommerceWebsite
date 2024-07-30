import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  fetchOrderByIdAsync,
  selectOrderDetails,
  updateOrderByIdAsync,
} from "../AdminSlice";
import { useForm } from "react-hook-form";

export const AdminEditOrderForm = () => {
  const { orderId } = useParams();
  const order = useSelector(selectOrderDetails);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  function setDefaultValues() {
    if (order) {
      setValue("billingName", order.billingName);
      setValue("phoneNumber", order.phoneNumber);
      setValue("paymentStatus", order.paymentStatus);
      if (order.address) {
        setValue("street", order.address.street || "");
        setValue("city", order.address.city || "");
        setValue("state", order.address.state || "");
        setValue("pinCode", order.address.pinCode || "");
      }
      setValue("items", order.items);
    }
  }

  useEffect(() => {
    setDefaultValues();
  }, [order]);

  useEffect(() => {
    dispatch(fetchOrderByIdAsync({ orderId }));
  }, [dispatch]);

  const validations = {
    billingName: {
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
    phoneNumber: {
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
    street: {
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
    pinCode: {
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

  function handleFormSubmit(data) {
    const updatedOrderDetails = {
      ...order,
      billingName: data.billingName,
      phoneNumber: data.phoneNumber,
      paymentStatus: data.paymentStatus,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        pinCode: data.pinCode,
      },
      items: data.items,
    };
    dispatch(updateOrderByIdAsync({ orderId, updatedOrderDetails }));
  }

  return (
    <div className="wrapper sm:mx-16 my-5 bg-white box-border p-4">
      <header className="font-bold text-4xl">Order Details </header>
      <div className="text-lg mt-2 font-semibold">#{orderId}</div>

      {order && (
        <form className="mt-5" onSubmit={handleSubmit(handleFormSubmit)}>
          {/* billing name  */}
          <div className="name mb-4 w-[100%] flex items-center gap-2">
            <label className="font-medium text-sm">Billing Name</label>
            <input
              type="text"
              {...register("billingName", { ...validations.billingName })}
              className={`focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.billingName && (
              <span className="text-sm text-red-600">
                *{errors.billingName.message}
              </span>
            )}
          </div>

          {/* phone Number  */}
          <div className="phoneNumber mb-4 w-[100%] flex items-center gap-2">
            <label className="font-medium text-sm">Phone Number </label>
            <input
              type="text"
              {...register("phoneNumber", { ...validations.phoneNumber })}
              className={`focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none ${
                errors.phoneNumber ? "border-red-500" : ""
              }`}
            />
            {errors.phoneNumber && (
              <span className="text-sm text-red-600">
                *{errors.phoneNumber.message}
              </span>
            )}
          </div>

          {/* total amount    */}
          <div className="totalAmount mb-4 ">
            <label className="font-medium text-sm">Total Amount :</label>
            <span className="ml-2">${order.totalAmount}</span>
          </div>

          {/* Payment Status  */}
          <div className="paymentStatus mb-4 w-[100%] flex items-center gap-2">
            <label className="font-medium text-sm">Payment Status</label>
            <select
              className="hover:cursor-pointer focus:border-indigo-600 px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              {...register("paymentStatus")}
            >
              <option>pending</option>
              <option>fulfilled</option>
            </select>
          </div>

          {/* ordered at  */}
          <div className="orderedAt mb-4 ">
            <label className="font-medium text-sm">Ordered At :</label>
            <span className="ml-2">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : ""}
            </span>
          </div>

          {/* address  */}
          {order.address && (
            <>
              <div className="street-address mb-4">
                <label htmlFor="streetAddress" className="font-medium text-sm">
                  Street Address
                </label>
                <input
                  {...register("street", { ...validations.street })}
                  type="text"
                  className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                />
                {errors.street && (
                  <span className="text-sm text-red-600">
                    *{errors.street.message}
                  </span>
                )}
              </div>
              <div className="other-address-details lg:flex flex-row items-center justify-between">
                <div className="city w-[90%] mb-4 lg:w-[30%]">
                  <label htmlFor="city" className="font-medium text-sm">
                    City
                  </label>
                  <input
                    {...register("city", { ...validations.city })}
                    type="text"
                    className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                  />
                  {errors.city && (
                    <span className="text-sm text-red-600">
                      *{errors.city.message}
                    </span>
                  )}
                </div>

                <div className="state w-[90%] mb-4 lg:w-[30%]">
                  <label htmlFor="state" className="font-medium text-sm">
                    State/Province
                  </label>
                  <input
                    {...register("state", { ...validations.state })}
                    type="text"
                    className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                  />
                  {errors.state && (
                    <span className="text-sm text-red-600">
                      *{errors.state.message}
                    </span>
                  )}
                </div>

                <div className="pincode w-[90%] mb-4 lg:w-[30%]">
                  <label htmlFor="pincode" className="font-medium text-sm">
                    ZIP / Postal Code
                  </label>
                  <input
                    {...register("pinCode", { ...validations.pinCode })}
                    type="text"
                    className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                  />
                  {errors.pinCode && (
                    <span className="text-sm text-red-600">
                      *{errors.pinCode.message}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
          {/* total Items*/}
          <div className="totalItems mb-4 ">
            <label className="font-medium text-sm">Total Items :</label>
            <span className="ml-2">{order.totalItems}</span>
          </div>

          {/* items  */}
          <div className="items">
            <label className="font-medium text-sm">Items : </label>
            {order.items?.map((item, itemIndex) => (
              <>
                <div className="productTile-wrapper w-full flex flex-row  items-center p-2 py-6 min-h-[120px] ">
                  {/* image */}
                  <div className="image h-[100px] w-[100px] rounded-md overflow-hidden flex flex-shrink-0">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      className="h-full w-full"
                    />
                  </div>

                  {/* details */}
                  <div className="details w-[calc(100%-100px)] flex flex-col gap-1 ml-3">
                    <div className="flex flex-row justify-between">
                      <span>{item.product.title}</span>
                      <span>
                        $
                        {Math.floor(
                          ((100 - item.product.discountPercentage) / 100) *
                            item.product.price
                        )}
                      </span>
                    </div>
                    <div className=" w-[90%] whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.product.description}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row gap-1 items-center ">
                        <label htmlFor="quantity" className="mr-1">
                          Quantity :
                        </label>
                        {item.quantity}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-2">
                  <label className="font-semibold">Size : </label>
                  <span>{item.size}</span>
                </div>
                <div className="ml-2">
                  <label className="font-semibold">Color : </label>
                  <span>{item.color}</span>
                </div>
                <div className="ml-2">
                  <label className="font-semibold">Color Code : </label>
                  <span>{item.colorCode}</span>
                </div>

                <div className="status ml-2">
                  <lable className="font-semibold">Status : </lable>
                  <select
                    {...register(`items[${itemIndex}.status]`)}
                    className="hover:cursor-pointer focus:border-indigo-600 px-2 mt-2 h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                  >
                    <option>pending</option>
                    <option>dispatched</option>
                    <option>delivered</option>
                    <option>received</option>
                    <option>cancelled</option>
                  </select>
                </div>
                <hr className="border-1 mt-3 border-slate-500" />
              </>
            ))}
          </div>

          {/* Submit Button */}
          <div className="button-wrapper flex flex-row mt-5 justify-end">
            <button
              className="h-5 w-20 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md"
              onClick={() => setDefaultValues()}
            >
              Reset
            </button>
            <button
              type="submit"
              className="h-5 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
            >
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
