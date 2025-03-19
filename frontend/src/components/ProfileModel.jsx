import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { profileValidations } from "../validations/validations";

const fields = {
  fullName: "",
  profile_img: "",
};
const ProfileModel = ({ editUserOpen, setEditUserOpen }) => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({ ...fields });
  const [uploadPhoto, setUploadPhoto] = useState(user?.profile_img || "");
  const [errors, setErrors] = useState({ ...fields });

  useEffect(() => {
    setData({
      fullName: user?.fullName,
      profile_img: user?.profile_img,
    });
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const file = e.target.files?.[0];

    setErrors({ ...fields });

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

  // TODO: userData is not passing to the backend
  // also implement the photo update logic in the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(data.fullName, data.profile_img);
    profileValidations
      .validate(data, { abortEarly: false })
      .then(() => {
        const userData = new FormData();
        userData.append("fullName", data.fullName);
        userData.append("profile_img", data.profile_img);
        console.log([...userData.entries()]);
        axios
          .post("/auth/update-account", userData)
          .then((res) => {
            if (res.response.data.success) {
              setData({ ...fields });
              toast.success(res?.response?.data?.message);
              setEditUserOpen(!editUserOpen);
            } else {
              toast.error(res?.response?.data?.message);
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.message);
          });
      })
      .catch((err) => {
        console.log(err);
        const formattedErrors = err?.inner?.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        setErrors(formattedErrors);
      });
  };
  return (
    <>
      {createPortal(
        <div
          className=" flexCenter h-full w-full absolute top-0 left-0 bg-gray-10 bg-opacity-50 text-center "
          onClick={() => {
            setEditUserOpen(!editUserOpen);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[300px]  bg-white rounded-lg shadow-lg p-2"
          >
            <form
              onSubmit={handleSubmit}
              className="w-full text-gray-30 flex flex-col gap-4"
            >
              <h3 className="font-semibold text-xl text-left">Profile</h3>
              <div className="flexStart flex-col gap-2">
                <h4 className="text-left w-full">Name</h4>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="w-full ring-0 border-b-[2px]  outline-primaryGreenOne"
                  value={data?.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <p className="text-sm  text-red-500 font-semibold ">
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div className="flexStart flex-col gap-2">
                <h4 className="text-left w-full">Photo</h4>
                <div className="flexStart gap-4 w-full">
                  {uploadPhoto ? (
                    <img
                      src={uploadPhoto}
                      alt="profile img preview"
                      className="h-12 w-12 rounded-full"
                    />
                  ) : (
                    ""
                  )}
                  <label htmlFor="profile_img">
                    <span className=" hover:border-primary cursor-pointer">
                      <p className="text-sm font-semibold text-black text-ellipsis line-clamp-1">
                        choose photo
                      </p>
                    </span>
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
                <div className="border-t-2 w-full flexEnd gap-2 p-2">
                  <button
                    className="rounded-md px-4 py-1 border-2 border-primaryGreenOne text-primaryGreenOne"
                    onClick={(e) => {
                      e.preventDefault();
                      setEditUserOpen(!editUserOpen);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md px-4 py-1 border-2 border-primaryGreenOne bg-primaryGreenOne text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </>
  );
};

export default ProfileModel;
