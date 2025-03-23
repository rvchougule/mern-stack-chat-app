import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router";
import { useDispatch } from "react-redux";
import io from "socket.io-client";
import { setOnlineUser } from "../redux/userSlice";
import { useEffect } from "react";
import useSocket from "../hooks/useSocket";

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { setSocketConnection } = useSocket();
  const basePath = location.pathname === "/";

  /***socket connection */
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: JSON.parse(localStorage.getItem("accessToken")),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    setSocketConnection(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <div className="flex bg-slate-100  overflow-hidden">
      <SideBar />
      <section className={`w-full ${basePath && "hidden"}`}>
        <Outlet />
      </section>
      <div
        className={`justify-center items-center flex-col gap-2 bg-bgImg bg-cover bg-center w-full hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <p className="text-xl font-bold mt-2 text-primaryGreenOne">
          Select user to send message
        </p>
      </div>
    </div>
  );
}

export default Home;
