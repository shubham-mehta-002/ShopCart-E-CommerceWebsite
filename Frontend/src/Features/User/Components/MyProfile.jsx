import { useSelector, useDispatch } from "react-redux";
import {
  fetchUserDetailsAsync,
  selectUserState,
  updateUserDetailsAsync,
} from "../UserSlice";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import { RiDeleteBinFill } from "react-icons/ri";
import { useForm } from "react-hook-form";

export function MyProfile() {
  const dispatch = useDispatch();
  const [selectedAddressForUpdation, setSelectedAddressForUpdation] =
    useState(null);
  const [editFields, setEditFields] = useState({
    name: false,
    phoneNumber: false,
  });
  const [filedValue, setFiledValue] = useState({
    name: "",
    phoneNumber: "",
  });
  const { userInfo, status, error } = useSelector(selectUserState);
  console.log({ userInfo });
  console.log({ editFields });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const validation = {
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

  function removeAddressHandler(addressIndex) {
    const newData = {
      address: userInfo.address.filter((_, index) => index !== addressIndex),
    };
    dispatch(updateUserDetailsAsync({ newData }));
  }

  function setAddressInForm(addressIndex) {
    setSelectedAddressForUpdation(addressIndex);
    setValue("streetAddress", userInfo.address[addressIndex].street);
    setValue("city", userInfo.address[addressIndex].city);
    setValue("state", userInfo.address[addressIndex].state);
    setValue("pincode", userInfo.address[addressIndex].pinCode);
    console.log({ addressIndex });
  }

  function updateAddressHandler(data, e) {
    console.log({data, userInfo})
    e.preventDefault();
    if ( userInfo.address.length !== 0  && 
      (data.streetAddress ===
        userInfo.address[selectedAddressForUpdation].street &&
      data.city === userInfo.address[selectedAddressForUpdation].city &&
      data.state === userInfo.address[selectedAddressForUpdation].state &&
      data.pincode === userInfo.address[selectedAddressForUpdation].pinCode)
    ) {
      alert("Change some value before updating ...");
      return;
    }

    const newData = {
      address: [
        ...userInfo.address.filter(
          (_, index) => index !== selectedAddressForUpdation
        ),
        {
          city: data.city,
          state: data.state,
          pinCode: data.pincode,
          street: data.streetAddress,
        },
      ],
    };

    dispatch(updateUserDetailsAsync({ newData }));
  }

  function updateUserNameHandler() {
    const value = filedValue.name;

    if (value.trim() === "") {
      alert("Name can't be empty");
      return;
    }
    const namePattern = /^[A-Za-z ]+$/;
    if (!namePattern.test(value)) {
      alert("Enter a valid name");
      return;
    }
    const newData = {
      fullName:value
    }
    dispatch(updateUserDetailsAsync({ newData }));
    setEditFields(prev => ({...prev , name:!prev.name}))
  }

  function updateUserPhoneNumberHandler() {
    const value = filedValue.phoneNumber;
    console.log(value.length)
    if (value.trim() === "") {
      alert("phone number can't be empty");
      return;
    }
    if(value.length !== 10){
      alert("Enter a valid 10 digit number")
      return;
    }
    const phoneNumberPattern = /[0-9]{10}/
    if (!phoneNumberPattern.test(value)) {
      alert("Enter a valid phone number");
      return;
    }

    const newData = {
      phoneNumber: value
    }
    dispatch(updateUserDetailsAsync({ newData}));
    setEditFields(prev => ({...prev , phoneNumber:!prev.phoneNumber}))

  }

  useEffect(() => {
    dispatch(fetchUserDetailsAsync());
  }, [dispatch]);

  return (
    <>
      {status === "loading" ? (
        <p>Loading ...</p>
      ) : (
        <div className="order-wrapper mx-auto sm:mx-16 xl:mx-36 mt-8 bg-white px-3 sm:px-10 mb-5 pb-5">
          <div className="header text-5xl mb-8 text-center font-bold pt-4">
            My Profile
          </div>
          <hr className="border-1 sm:w-[100%] border-gray-400" />

          <div className="name text-2xl sm:pl-4 sm:p-0 font-bold my-4 flex flex-col sm:flex-row gap-6">
            <div className="flex gap-3 items-center">
              <div>
                Name :
                <span className="text-[#5557d4]">
                  {" "}
                  {userInfo.fullName || "New User"}
                </span>
              </div>
              <MdEdit
                className="h-6 w-6 bg-[#d5cece] hover:cursor-pointer"
                onClick={() =>
                  setEditFields((prev) => ({ ...prev, name: !prev.name }))
                }
              />
            </div>
            {editFields.name && (
              <div className="flex gap-5 items-center">
                <input
                  type="text"
                  className="focus:border-indigo-600 px-2 w-[200px] h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none text-lg"
                  value={filedValue.number}
                  onChange={(e) =>
                    setFiledValue((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
                <button
                  onClick={(e) => updateUserNameHandler(e)}
                  className="h-9 w-[50px] hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold"
                  // disabled={loginState.status !== 'idle'}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="name text-xl text-red-600 sm:pl-4 sm:p-0 font-bold my-4">
            Role :<span className="uppercase"> {userInfo.role}</span>
          </div>

          <div className="email text-lg font-bold sm:pl-4 sm:p-0 mb-4">
            Email Address :{" "}
            <span className="text-[#5557d4]">{userInfo.email}</span>
          </div>

          <div className="name text-2xl sm:pl-4 sm:p-0 font-bold my-4 flex flex-col sm:flex-row gap-6">
            <div className="flex gap-3 text-lg font-bold items-center">
              <div>
                Phone number :
                <span className="text-[#5557d4]">
                  {userInfo.phoneNumber || "XXXXX-XXXXX"}
                </span>
              </div>
              <MdEdit
                className="h-6 w-6 bg-[#d5cece] hover:cursor-pointer"
                onClick={() =>
                  setEditFields((prev) => ({
                    ...prev,
                    phoneNumber: !prev.phoneNumber,
                  }))
                }
              />
            </div>
            {editFields.phoneNumber && (
              <div className="flex gap-5 items-center">
                <input
                  value={filedValue.phoneNumber}
                  onChange={(e) =>
                    setFiledValue((prev) => ({
                      ...prev,
                      phoneNumber: e.target.value,
                    }))
                  }
                  type="text"
                  className="focus:border-indigo-600 px-2 w-[200px] h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none text-lg"
                />
                <button
                  className="h-9 w-[50px] hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold"
                  onClick={(e) => updateUserPhoneNumberHandler(e)}
                  // disabled={loginState.status !== 'idle'}
                >
                  Save
                </button>
              </div>
            )}
          </div>

          <hr className="border-1 sm:w-[100%] border-gray-400" />

          {/* update address Form */}
          {selectedAddressForUpdation!==null && <form onSubmit={handleSubmit(updateAddressHandler)} className="mt-4">
            {/* street  */}
            <div className="street-address mb-8">
              <label htmlFor="streetAddress" className="font-medium text-sm">
                Street Address
              </label>
              <input
                {...register("streetAddress", {
                  ...validation.streetAddress,
                })}
                type="text"
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errors.streetAddress && (
                <span className="text-sm text-red-600">
                  *{errors.streetAddress.message}
                </span>
              )}
            </div>

            <div className="other-address-details lg:flex flex-row items-center justify-between">
              <div className="city w-[100%] mb-8 lg:w-[30%]">
                <label htmlFor="city" className="font-medium text-sm">
                  City
                </label>
                <input
                  {...register("city", { ...validation.city })}
                  type="text"
                  className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                />
                {errors.city && (
                  <span className="text-sm text-red-600">
                    *{errors.city.message}
                  </span>
                )}
              </div>

              <div className="state w-[100%] mb-8 lg:w-[30%]">
                <label htmlFor="state" className="font-medium text-sm">
                  State/Province
                </label>
                <input
                  {...register("state", { ...validation.state })}
                  type="text"
                  className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                />
                {errors.state && (
                  <span className="text-sm text-red-600">
                    *{errors.state.message}
                  </span>
                )}
              </div>

              <div className="pincode w-[90%] mb-8 lg:w-[30%]">
                <label htmlFor="pincode" className="font-medium text-sm">
                  ZIP / Postal Code
                </label>
                <input
                  {...register("pincode", { ...validation.pincode })}
                  type="text"
                  className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
                />
                {errors.pincode && (
                  <span className="text-sm text-red-600">
                    *{errors.pincode.message}
                  </span>
                )}
              </div>
            </div>

            <div className="button-wrapper flex flex-row justify-end">
              <button
                type="button"
                className="h-5 w-20 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md"
                onClick={() => reset()}
              >
                Reset
              </button>
              <button
                type="submit"
                className="h-5 w-30 px-3 py-4 flex items-center justify-center rounded-md font-semibold text-md text-white bg-[#4338CA]"
              >
                Update Address
              </button>
            </div>
          </form>}
          {/* form ends */}

          <div className="addresses pl-4 mt-5 sm:p-0">
            <span className="font-semibold">Your addresses :</span>
            <div className="flex flex-col gap-2 w-[100%]">
              {userInfo?.address?.length === 0 ? (
                <p className="text-lg mt-4 font-semibold ">
                  No saved addresses
                </p>
              ) : (
                userInfo?.address?.map((userAddress, index) => {
                  return (
                    <div
                      className="border-2 flex flex-row gap-1 p-2 break-words w-full"
                      key={index}
                    >
                      <div className="address-details flex flex-col w-[70%] break-words">
                        <div>{userAddress.street}</div>
                        <div>
                          {userAddress.city}, {userAddress.state}
                        </div>
                        <div>{userAddress.pinCode}</div>
                      </div>

                      <div className="options w-[30%] justify-center items-end flex flex-col gap-2 mr-5">
                        <div
                          onClick={() => setAddressInForm(index)}
                          className="flex items-center justify-center gap-3 hover:cursor-pointer"
                          type="button"
                        >
                          <MdEdit className="h-5 w-5" /> Edit
                        </div>
                        <div
                          onClick={() => removeAddressHandler(index)}
                          className="flex items-center justify-center gap-3 hover:cursor-pointer"
                          type="button"
                        >
                          <RiDeleteBinFill className="h-5 w-5" /> Remove
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
