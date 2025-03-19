import React from "react";
import Avatar from "./Avatar";

const MessagePageHeader = ({ user }) => {
  return (
    <div className="h-14 flexStart gap-2 bg-white   border-b-[1px] border-slate-300 shadow-md px-4 py-2 w-full">
      <Avatar url={user?.profile_img} name={user?.fullName} />
      <div className="">
        <h2 className="font-bold text-slate-600">{user?.fullName}</h2>
        <p>online</p>
      </div>
    </div>
  );
};

export default MessagePageHeader;
