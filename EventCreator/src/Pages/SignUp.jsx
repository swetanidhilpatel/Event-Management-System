import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [userObject, setUserObject] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobilenumber: "",
    skypeID: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    const {
      firstname,
      confirmPassword,
      email,
      isAdmin,
      lastname,
      mobilenumber,
      password,
      skypeID,
    } = userObject;

    if (!(password.length > 5)) {
      return setErrorMessage("Password must be at least 6 characters");
    }

    if (!(password === confirmPassword)) {
      return setErrorMessage("Password and Confirm Password must be the same");
    }

    try {
      const response = await axios.post(
        "https://event-creator-backend.vercel.app/api/v1/user/signup",
        {
          firstname,
          lastname,
          email,
          mobilenumber: mobilenumber.toString(),
          password: password.toString(),
          skypeID,
          isAdmin,
        }
      );
      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "Error while creating user";

      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="w-full h-full pt-4">
      <div className="max-w-screen-xl px-5 m-auto mb-10 sm:px-4 md:px-1 w-full">
        <div className=" flex items-center flex-col">
          <div className="flex md:gap-[74px] gap-8 items-center justify-center">
            <h1 className="md:text-3xl mb-3 text-sm text-orange-500 font-['open_sans'] font-semibold">
              Indian Events
            </h1>
          </div>

          <form
            className="flex flex-col md:w-[22vw] w-[62vw] items-center gap-1"
            action=""
          >
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              name="first_name"
              placeholder="First Name"
              onChange={(e) =>
                setUserObject({ ...userObject, firstname: e.target.value })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              name="last_name"
              placeholder="Last Name"
              onChange={(e) =>
                setUserObject({ ...userObject, lastname: e.target.value })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              name="email"
              placeholder="Email-Id"
              onChange={(e) =>
                setUserObject({ ...userObject, email: e.target.value })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              name="mobile_number"
              placeholder="Mobile Number"
              onChange={(e) =>
                setUserObject({
                  ...userObject,
                  mobilenumber: e.target.value.toString(),
                })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              name="skype_id"
              placeholder="Skype ID(Optional)"
              onChange={(e) =>
                setUserObject({ ...userObject, skypeID: e.target.value })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) =>
                setUserObject({ ...userObject, password: e.target.value })
              }
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              onChange={(e) =>
                setUserObject({
                  ...userObject,
                  confirmPassword: e.target.value,
                })
              }
            />
            <button
              type="submit"
              onClick={submitHandler}
              className="px-3 my-3 py-1 w-full h-min font-['open_sans'] text-white bg-orange-500 rounded hover:bg-white border border-orange-500 hover:text-orange-500"
            >
              Register
            </button>
            {errorMessage && (
              <div className="text-red-500 text-centr w-full font-semibold mt-2 text-sm">
                ❌ {errorMessage}
              </div>
            )}
          </form>

          <p className="text-black text-sm mt-3">
            Already Have An Account?
            <button
              onClick={() => navigate("/login")}
              className="px-1 cursor-pointer underline"
            >
              Login
            </button>
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-1 cursor-pointer underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
