import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import { FiArrowUpLeft } from "react-icons/fi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router";
import ProfileModel from "./ProfileModel";
import UserExplorer from "./UserExplorer";
import axios from "axios";
import { toast } from "react-toastify";

const SideBar = () => {
  const user = useSelector((state) => state.user);
  const [explorer, setExplorer] = useState(true);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/message/users")
      .then((res) => {
        if (res.data.success) {
          setAllUser(res?.data?.data);
        } else {
          toast.error(res?.response?.data?.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message);
      });
  }, [user]);

  return (
    <div className="h-[100vh] flex">
      {/* small sidebar menu */}
      <div className="h-full  w-8 lg:w-12 text-2xl text-gray-50 py-8 flexColWFull items-center justify-between shadow-md">
        <div className="flex flex-col items-center justify-center gap-3 py-2 w-full">
          <div
            className={`${
              explorer && "bg-slate-300"
            } w-full flexCenter p-2  cursor-pointer`}
          >
            <IoChatbubbleEllipses onClick={() => setExplorer(!explorer)} />
          </div>
          <div
            className={`${
              openSearchUser && "bg-slate-300"
            } w-full flexCenter p-2  cursor-pointer`}
          >
            <FaUserPlus
              className="cursor-pointer"
              onClick={() => setOpenSearchUser(!openSearchUser)}
            />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-3 flex-end">
          <div
            className={`${
              editUserOpen && "bg-slate-300"
            } w-full flexCenter cursor-pointer`}
            onClick={() => setEditUserOpen(!editUserOpen)}
          >
            <Avatar url={user.profile_img} name={user.fullName} />
          </div>
          <BiLogOut
            className="cursor-pointer"
            onClick={() => {
              dispatch(logout());
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/login");
            }}
          />
        </div>
      </div>
      {/* user chat explorer */}
      {explorer && (
        <div className={`lg:flex w-48 h-full bg-white shadow-xl  `}>
          <div className="h-full w-full">
            <div className="px-2 py-3 h-14 font-semibold text-lg border-b-[1px] border-slate-300 shadow-md">
              Messages
            </div>
            {/* chats explorer*/}
            <div className="h-full ">
              {/* Empty chats explorer */}
              <div className="py-28 flexCenter flex-col">
                <FiArrowUpLeft size={40} className="text-gray-30" />
                <h3 className="text-center text-gray-20">
                  Explore user to start a conversation with.
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
      {openSearchUser && (
        <UserExplorer
          openSearchUser={openSearchUser}
          setOpenSearchUser={setOpenSearchUser}
          allUser={allUser}
        />
      )}
      {editUserOpen && (
        <ProfileModel
          editUserOpen={editUserOpen}
          setEditUserOpen={setEditUserOpen}
        />
      )}
    </div>
  );
};

export default SideBar;
