import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {useDispatch , useSelector} from "react-redux"
import { resetPasswordRequestAsync , selectMailSentStatus , resetMailSentStatus ,selectAuthStatus} from "../AuthSlice";

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const dispatch = useDispatch()

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
  };

  const mailSentStatus = useSelector(selectAuthStatus)
  // console.log({mailSentStatus})

  function forgotPasswordFormHandler(data) {
    // console.log(data);
    dispatch(resetPasswordRequestAsync({email:data.email}))
    dispatch(resetMailSentStatus()) // remove karo aur timer lagaoo that after 10 sec it will reset MAIL ALREADY SENT
  }

  
  return (
    <>
      <div className="h-screen w-screen  flex items-center justify-center">
        <div className="login-form-wrapper h-[90%] w-[90%] sm:w-full sm:max-w-md mx-auto ">
          <div className="image-wrapper flex items-center justify-center flex-col py-5">
            <img
              src="https://mern-ecommerce-lyart.vercel.app/ecommerce.png"
              alt="logo"
              className="h-20 w-20"
            />
            <div className="mt-8 px-4 text font-bold text-2xl text-center">
              Enter email to reset password
            </div>
          </div>
          {/* form start */}
          <form
            onSubmit={handleSubmit(forgotPasswordFormHandler)}
            className="form-wrapper mt-10 px-5 flex flex-col gap-5 "
          >
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

            <button className="h-9 w-full hover:bg-[#6366F1] bg-[rgb(79,70,229)] rounded-md border-2 text-white outline-none text-sm font-semibold">
              { mailSentStatus ==="idle" ? "Send Mail" : "Sending Mail"}
            </button>

            <div className="signup-link mt-5 text-center">
              <span className=" text-center text-sm text-gray-500  hover:cursor-pointer">
                Send me back to{" "}
              </span>
              <span className=" font-semibold text-center text-sm text-[rgb(79,70,229)] hover:text-[#6366F1] hover:cursor-pointer">
                <Link to="/login">Login</Link>
              </span>
            </div>
          </form>
          {/* form ends */}
        </div>
      </div>
    </>
  );
}
