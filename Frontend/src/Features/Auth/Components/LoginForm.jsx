import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUserAsync,
  selectLoggedInUser,
  selectAuthState,
} from "../AuthSlice";
import logo from "../../../assets/logo.png"


export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const validations = {
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

    password: {
      required: {
        value: true,
        message: "Password is required",
      },
      validate: (password) => {
        if (password.trim() === "") return "Password field can't be empty";
        return true;
      },
    },
  };

  const dispatch = useDispatch();
  const loginState = useSelector(selectAuthState);
  const navigate = useNavigate();

  const user = useSelector(selectLoggedInUser);

  function formSubmitHandler({ email, password }) {
    dispatch(loginUserAsync({ email, password ,navigate}));
  }

  

  return (
    <>
      <div className="h-screen w-screen  flex items-center justify-center">
        <div className="login-form-wrapper h-[90%] w-[90%] sm:w-full sm:max-w-md mx-auto ">
          <div className="image-wrapper flex items-center justify-center flex-col py-5">
            <img
              src={logo}
              alt="logo"
              className="size-32"
            />
            <div className="mt-8 px-4 text font-bold text-3xl text-center">
              Log in to your account
            </div>
          </div>
          {/* form starts */}
          <form
            onSubmit={handleSubmit(formSubmitHandler)}
            className="form-wrapper mt-10 px-5 flex flex-col gap-5 "
          >
            {/* email field */}
            <div className="email ">
              <label htmlFor="email" className=" font-semibold">
                Email address
              </label>
              <br />
              <input
                type="text"
                {...register("email", { ...validations.email })}
                className="focus:border-indigo-600 px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errors.email && (
                <span className="text-sm text-red-600">
                  *{errors.email.message}
                </span>
              )}
            </div>

            {/* password field */}
            <div className="password relative">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className=" font-semibold">
                  Password
                </label>
                <br />
                <span className=" font-semibold text-center text-sm text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </span>
              </div>
              {!showPassword ? (
                <FaEye
                  className="absolute top-10 right-2 h-5 w-5"
                  onClick={() => setShowPassword((prevVal) => !prevVal)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute top-10 right-2 h-5 w-5"
                  onClick={() => setShowPassword((prevVal) => !prevVal)}
                />
              )}

              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { ...validations.password })}
                className="focus:border-indigo-600  px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  *{errors.password.message}
                </span>
              )}
            </div>

            {/* login Button */}
            <button
              className="h-9 w-full hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold"
              disabled={loginState.status !== "idle"}
            >
              {loginState.status !== "idle" ? "Logging" : "Log in"}
            </button>

            {/* sign up link */}
            <div className="signup-link mt-5 text-center">
              <span className=" text-center text-sm text-gray-500  hover:cursor-pointer">
                Not a member?{" "}
              </span>

              <span className=" font-semibold text-center text-sm text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/signup">Create an account</Link>
              </span>
            </div>
          </form>
          {/* form ends */}
        </div>
      </div>
    </>
  );
}
