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
import { NavLink, useNavigate } from "react-router";
import ProfileModel from "./ProfileModel";
import UserExplorer from "./UserExplorer";
import axios from "axios";
import { toast } from "react-toastify";
import useSocket from "../hooks/useSocket";
import moment from "moment";

const SideBar = ({ explorer, setExplorer }) => {
  const user = useSelector((state) => state.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [conversationUser, setConversationUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { socketConnection } = useSocket();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((convUser) => {
          if (convUser?.sender?._id === convUser?.receiver?._id) {
            return {
              ...convUser,
              userDetails: convUser?.sender,
            };
          } else if (convUser?.receiver?._id !== user?._id) {
            return {
              ...convUser,
              userDetails: convUser.receiver,
            };
          } else {
            return {
              ...convUser,
              userDetails: convUser.sender,
            };
          }
        });

        setConversationUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);
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
        <div
          className={`w-[calc(100vw-32px)] xs:w-48 h-full bg-white shadow-xl  `}
        >
          <div className="h-full w-full ">
            <div className="px-2 py-3 h-14 font-semibold text-lg border-b-[1px] border-slate-300 shadow-md">
              Messages
            </div>
            {/* chats explorer*/}

            <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
              {allUser.length == 0 && (
                <div className="mt-12">
                  <div className="flex justify-center items-center my-4 text-slate-500">
                    <FiArrowUpLeft size={50} />
                  </div>
                  <p className="text-lg text-center text-slate-400">
                    Explore users to start a conversation with.
                  </p>
                </div>
              )}

              {conversationUser.map((conv) => {
                return (
                  <NavLink
                    to={"/" + conv?.userDetails?._id}
                    key={conv?._id}
                    className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
                  >
                    <div>
                      <Avatar
                        url={conv?.userDetails?.profile_img}
                        name={conv?.userDetails?.fullName}
                      />
                    </div>
                    <div className="w-full">
                      <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                        {conv?.userDetails?.fullName}
                      </h3>
                      <div className="text-slate-500 text-xs flex items-center gap-1">
                        <div className="flex items-center gap-1">
                          {conv?.lastMsg?.imageUrl && (
                            <div className="flex items-center gap-1">
                              <span>
                                <FaImage />
                              </span>
                              {!conv?.lastMsg?.text && <span>Image</span>}
                            </div>
                          )}
                          {conv?.lastMsg?.videoUrl && (
                            <div className="flex items-center gap-1">
                              <span>
                                <FaVideo />
                              </span>
                              {!conv?.lastMsg?.text && <span>Video</span>}
                            </div>
                          )}
                        </div>
                        <p className="text-ellipsis line-clamp-1">
                          {conv?.lastMsg?.text}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-end ml-4 float-end block   xs:w-fit">
                      {moment(conv?.lastMsg.createdAt).format("H:mm")}
                    </span>
                    {Boolean(conv?.unseenMsg) && (
                      <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                        {conv?.unseenMsg}
                      </p>
                    )}
                  </NavLink>
                );
              })}
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
