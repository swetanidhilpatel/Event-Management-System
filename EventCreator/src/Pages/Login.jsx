import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const HandleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://event-creator-backend.vercel.app/api/v1/user/login",
        {
          username,
          password,
        }
      );

      await localStorage.setItem("token", response.data.token);

      await navigate("/");
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : error.message || "Error while creating user";

      setErrorMessage(errorMessage);
    }
  };

  return (
    <div className="w-full h-full pt-16">
      <div className="max-w-screen-xl px-5 m-auto  mt-10 mb-20 sm:px-4 md:px-1 w-full">
        <div className=" flex items-center flex-col">
          <div className="flex md:gap-[74px] gap-8 items-center justify-center">
            <h1 className="md:text-3xl mb-3 text-sm text-orange-500 font-['open_sans'] font-semibold">
              Indian Events
            </h1>
          </div>

          <form className="flex flex-col md:w-[22vw] w-[62vw] items-center gap-4">
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              type="text"
              placeholder={"Enter email/phone number"}
              name="username"
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              className="border my-1  border-zinc-300 text-zinc-800 text-xs outline-none px-2 py-3 rounded-md w-full"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              name="password"
              placeholder={"Enter your password"}
              type={"password"}
            />
            <button
              type="submit"
              onClick={HandleSubmit}
              className=" px-3  py-1 w-full h-min font-['open_sans'] text-white bg-orange-500 rounded hover:bg-white border border-orange-500 hover:text-orange-500"
            >
              Login
            </button>
            {errorMessage && (
              <div className="text-red-500 text-centr w-full font-semibold mt-2 text-sm">
                ❌ {errorMessage}
              </div>
            )}
            {/* <p className="text-blue-400 underline text-sm mt-5 cursor-pointer ">
              Forget password
            </p> */}

            <p className="text-black text-sm mt-5">
              Dont Have An Account?
              <button
                onClick={() => navigate("/signup")}
                className="px-1 cursor-pointer underline"
              >
                Sign Up
              </button>
            </p>

            <p>
              <button
                onClick={() => navigate("/")}
                className="px-1 cursor-pointer underline"
              >
                Go To Home Page
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
