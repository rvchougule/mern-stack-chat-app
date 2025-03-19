import React from "react";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router";

function Home() {
  return (
    <div className="flex bg-slate-100  overflow-hidden">
      <SideBar />
      <Outlet />
    </div>
  );
}

export default Home;
