import React from "react";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
const MessagePageHeader = ({
  user,
  selectedMessagesList = [],
  handleDeleteChat,
}) => {
  return (
    <div className="h-14 flexStart gap-2 bg-white   border-b-[1px] border-slate-300 shadow-md px-4 py-2 w-full">
      <Avatar url={user?.profile_img} name={user?.fullName} />
      <div className="w-full">
        <h2 className="font-bold text-slate-600">{user?.fullName}</h2>
        <p>
          {user?.online ? (
            <span className="text-primaryGreenOne">Online</span>
          ) : (
            <span className="text-slate-400">Offline</span>
          )}
        </p>
      </div>
      <div className="self-center">
        {selectedMessagesList.length != 0 && (
          <RiDeleteBin6Line
            size={20}
            color="red"
            className="cursor-pointer"
            onClick={handleDeleteChat}
          />
        )}
      </div>
      <div className="self-center ">
        <button className="cursor-pointer hover:text-primaryGreenOne">
          <HiDotsVertical />
        </button>
      </div>
    </div>
  );
};

export default MessagePageHeader;
