import { useForm } from "react-hook-form";
import { Link , Navigate , useNavigate} from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState , useEffect} from "react";
import { useSelector , useDispatch} from 'react-redux'
import { registerUserAsync , resetRegistrationStatus} from "../AuthSlice";
import {selectRegistrationStatus , selectAuthState , selectLoggedInUser } from '../AuthSlice'

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      required: "Password is required",
      validate: (value) => {
        if (!/[A-Z]/.test(value))
          return "Must include atleast one Uppercase letter";
        if (!/[a-z]/.test(value))
          return "Must include atleast one Lower letter";
        if (!/[!"#$%&'()*+,-.:;<=>?@[\]^_`{|}~]/.test(value))
          return "Must include atleast one special character";
        if (value.length < 8) return "Min length should be 8";
        return true;
      },
    },
    confirmPassword: {
      required: "Enter password again",
      validate: (value) => {
        const password = watch("password"); // Get the value of the password field
        if (password !== value) {
          return "Passwords do not match";
        }
        return true;
      },
    },
  };

  const dispatch = useDispatch()
  const registrationStatus = useSelector(selectRegistrationStatus)
  const user = useSelector(selectLoggedInUser)

  const signUpState = useSelector(selectAuthState)

  const navigate = useNavigate()

  async function formSubmitHandler({email,password}) {
    dispatch(registerUserAsync({email,password}))
  }

  useEffect(()=>{
    if(registrationStatus){
      navigate("/login")
      dispatch(resetRegistrationStatus())
    }
  },[registrationStatus])

  return (
    <>
    {/* {registrationStatus && <Navigate to="/login" />} */}
      <div className="h-screen w-screen  flex items-center justify-center">
        <div className="login-form-wrapper h-[90%] w-[90%] sm:w-full sm:max-w-md mx-auto ">
          <div className="image-wrapper flex items-center justify-center flex-col py-5">
            <img
              src="https://mern-ecommerce-lyart.vercel.app/ecommerce.png"
              alt="logo"
              className="h-20 w-20"
            />
            <div className="mt-8 px-4 text font-bold text-3xl text-center">
              Create a new Account
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
                {...register("email", validations.email)}
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
              <label htmlFor="password" className=" font-semibold">
                Password
              </label>
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
                {...register("password", validations.password)}
                className="focus:border-indigo-600  px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errors.password && (
                <span className="text-sm text-red-600">
                  *{errors.password.message}
                </span>
              )}
            </div>

            {/* confirm-password  */}
            <div className="confirm-password relative">
              <label htmlFor="confirm-password" className=" font-semibold">
                Confirm password
              </label>
              {!showConfirmPassword ? (
                <FaEye
                  className="absolute top-10 right-2 h-5 w-5"
                  onClick={() => setShowConfirmPassword((prevVal) => !prevVal)}
                />
              ) : (
                <FaEyeSlash
                  className="absolute top-10 right-2 h-5 w-5"
                  onClick={() => setShowConfirmPassword((prevVal) => !prevVal)}
                />
              )}
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", validations.confirmPassword)}
                className="focus:border-indigo-600  px-2 mt-2 w-full h-9 bg-[#FFFFFF] rounded-md border-2 border-[#D1D5DB] outline-none"
              />
              {errors.confirmPassword && (
                <span className="text-sm text-red-600">
                  *{errors.confirmPassword.message}
                </span>
              )}
            </div>

            {/* signup button */}
            <button className="h-9 w-full hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold"
            disabled={isSubmitting}
            >
              {signUpState.status !== "idle" ? "Signing In" : "Sign Up"}
            </button>

            {/* login page link  */}
            <div className="signup-link mt-5 text-center">
              <span className=" text-center text-sm text-gray-500  hover:cursor-pointer">
                Already a member?{" "}
              </span>
              <span className=" font-semibold text-center text-sm text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/login">Log in</Link>
              </span>
            </div>
          </form>
          {/* form ends */}
        </div>
      </div>

   

    </>
  );
}
