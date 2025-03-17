import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { loginValidation } from "../validations/validations";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";

const records = {
  email: "",
  password: "",
};
function Login() {
  const [data, setData] = useState({ ...records });
  const [errors, setErrors] = useState({ ...records });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setErrors({ ...records });
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    loginValidation
      .validate(data, { abortEarly: false })
      .then(() => {
        const userData = new FormData();

        userData.append("email", data.email);
        userData.append("password", data.password);

        axios
          .post("/auth/login", data)
          .then((res) => {
            const result = res.data.data;

            setData({ ...records });
            dispatch(setUser(result?.user));
            dispatch(setToken(result.accessToken));
            localStorage.setItem("refreshToken", result.refreshToken);
            localStorage.setItem("accessToken", result.accessToken);
            toast.success(result.message);
            setTimeout(() => {
              navigate("/");
            }, 200);
          })
          .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message);
          });
      })
      .catch((err) => {
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };
  return (
    <div className="h-[100vh] w-full bg-bgImg bg-cover bg-center">
      <div className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] shadow-2xl  xs:w-[320px]">
        <form
          className="bg-white flexBetween flex-col p-4 gap-2 rounded-xl"
          onSubmit={handleSubmit}
        >
          <h3 className="w-full text-left font-bold text-secondaryGreen">
            Welcome to Chat app!
          </h3>
          <div className="flexColWFull">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              className=""
              onChange={handleInputChange}
              value={data?.email}
            />
            {errors.email && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.email}
              </p>
            )}
          </div>
          <div className="flexColWFull">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className=""
              onChange={handleInputChange}
              value={data?.password}
            />
            {errors.password && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.password}
              </p>
            )}
          </div>
          <div className="flexColWFull mt-3">
            <button className="btn-dark transform hover:scale-105">
              Login
            </button>
          </div>

          <p className="mt-3 font-semibold text-black">
            Not Registred Yet?{" "}
            <Link
              to="/signup"
              className="text-secondaryGreen cursor-pointer inline-block transform hover:scale-110"
            >
              register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
