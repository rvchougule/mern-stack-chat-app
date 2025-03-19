import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUpValidation } from "../validations/validations";
import axios from "axios";
import { toast } from "react-toastify";

const records = {
  fullName: "",
  email: "",
  password: "",
  profile_img: "",
};
function SignUp() {
  const [uploadPhoto, setUploadPhoto] = useState("");
  const [data, setData] = useState({ ...records });
  const [errors, setErrors] = useState({ ...records });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files?.[0];

    setErrors({ ...records });

    if (file) {
      // console.log(file);
      setData((prevState) => ({ ...prevState, [name]: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadPhoto(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    signUpValidation
      .validate(data, { abortEarly: false })
      .then(() => {
        const userData = new FormData();

        userData.append("fullName", data.fullName);
        userData.append("password", data.password);
        userData.append("email", data.email);
        userData.append("profile_img", data.profile_img);

        axios
          .post("/auth/signup", userData)
          .then((res) => {
            if (res.data.success) {
              setData({ ...records });
              toast.success(res.data.message);
              navigate("/login");
            } else {
              toast.error(res.data.message);
            }
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
          onSubmit={handleSubmit}
          className="bg-white flexBetween flex-col p-4 gap-2 rounded-xl"
        >
          <h3 className="w-full text-left font-bold text-secondaryGreen">
            Welcome to Chat app!
          </h3>
          <div className="flexColWFull w-full">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              className=""
              onChange={handleInputChange}
              value={data?.fullName}
            />
            {errors.fullName && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.fullName}
              </p>
            )}
          </div>
          <div className="flexColWFull w-full">
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
          <div className="flexColWFull w-full">
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
          <div className="flexColWFull w-full">
            <label htmlFor="profile_img">
              Profile Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
                  {uploadPhoto ? (
                    <img
                      src={uploadPhoto}
                      alt="profile img preview"
                      className="h-12 w-12 object-contain"
                    />
                  ) : (
                    "Upload profile photo"
                  )}
                </p>
              </div>
            </label>

            <input
              type="file"
              id="profile_img"
              name="profile_img"
              className="bg-slate-100 px-2 py-1 focus:outline-primary hidden"
              onChange={handleInputChange}
            />
            {errors.profile_img && (
              <p className="text-sm  text-red-500 font-semibold ">
                {errors.profile_img}
              </p>
            )}
          </div>
          <div className="flexColWFull w-full mt-3">
            <button className="btn-dark transform hover:scale-105">
              Sign Up
            </button>
          </div>

          <p className="mt-3 font-semibold text-black">
            Already have account ?{" "}
            <Link
              to="/login"
              className="text-secondaryGreen cursor-pointer inline-block transform hover:scale-110"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
