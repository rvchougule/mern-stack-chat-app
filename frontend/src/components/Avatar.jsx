import React from "react";

const extractName = (name = "") => {
  const name_split = name.split(" ");
  let userName = "";
  if (name_split.length == 3) {
    userName = `${name_split[0]?.slice(0, 1)} ${name_split[
      name_split.length - 1
    ]?.slice(0, 1)}`;
  } else if (name_split.length == 2) {
    userName = `${
      name_split[0]?.slice(0, 1) +
      name_split[name_split.length - 1]?.slice(0, 1)
    }`;
  } else {
    userName = `${name_split[0]?.slice(0, 1) + name_split[1]?.slice(0, 1)}`;
  }
  return userName?.split(" ").join("").toUpperCase();
};
function Avatar({ url, name }) {
  const nameInitial = extractName(name);
  return (
    <div className="flexCenter w-8 h-8 lg:w-10 lg:h-10 ring-1 rounded-full bg-slate-400 overflow-hidden cursor-pointer">
      {url ? (
        <img
          src={url}
          alt=""
          className="w-full h-full object-cover object-center "
        />
      ) : (
        <span className=" text-lg lg:text-xl font-bold text-black  px-1 py-1">
          {nameInitial}
        </span>
      )}
    </div>
  );
}

export default Avatar;
