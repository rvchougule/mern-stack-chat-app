import React, { useState } from "react";
import { createPortal } from "react-dom";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router";
import Avatar from "./Avatar";

const UserExplorer = ({ openSearchUser, setOpenSearchUser, allUser }) => {
  const [query, setQuery] = useState("");

  const filteredUser = allUser.filter((user) => {
    return (
      user?.fullName.toLowerCase().includes(query.toLowerCase()) ||
      user?.email.toLowerCase().includes(query.toLowerCase())
    );
  });
  return (
    <>
      {createPortal(
        <div
          className="flexCenter h-full w-full absolute top-0 left-0 bg-slate-200 bg-opacity-50 text-center"
          onClick={() => setOpenSearchUser(!openSearchUser)}
        >
          <div
            className="w-[300px] lg:w-[400px]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {/* search box */}
            <div className="flexCenter gap-2 px-2 bg-white">
              <input
                type="text"
                placeholder="Search user by name or email"
                className="w-full ring-0 outline-0 px-2 py-2 text-xl font-semibold text-slate-600 placeholder:text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="p-2">
                <IoIosSearch size={20} className="" />
              </div>
            </div>
            {/* Users */}
            <div className="mt-4 bg-white p-2 max-h-[300px] overflow-auto">
              {filteredUser?.map((user) => {
                return (
                  <Link
                    to={`/${user?._id}`}
                    onClick={() => setOpenSearchUser(!openSearchUser)}
                    key={user?._id}
                    className="w-full flex gap-2  border-b-[1px] border-gray-10 p-2 hover:border-primaryGreenOne hover:border-2 cursor-pointer"
                  >
                    {/* user photo */}
                    <Avatar url={user?.profile_img} name={user?.fullName} />
                    {/* user info */}
                    <div className="flex flex-col ">
                      <h2 className="text-start font-semibold text-slate-600">
                        {user?.fullName}
                      </h2>
                      <p className="text-start  text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>,
        document.getElementById("portal")
      )}
    </>
  );
};

export default UserExplorer;
