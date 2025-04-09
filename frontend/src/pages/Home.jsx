import SideBar from "../components/SideBar";
import { Outlet, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import { setOnlineUser } from "../redux/userSlice";
import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";

function Home() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { setSocketConnection } = useSocket();
  const [explorer, setExplorer] = useState(true);
  const [conversationUser, setConversationUser] = useState([]);
  const user = useSelector((state) => state.user);

  const basePath = location.pathname === "/";

  /***socket connection */
  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_SOCKET_URL, {
      auth: {
        token: JSON.parse(localStorage.getItem("accessToken")),
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    setSocketConnection(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  const { socketConnection } = useSocket();

  /****** get sidebar conversation users******/
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        // console.log("conversations", data);
        const conversationUserData = data.map((convUser) => {
          if (convUser.sender._id === convUser.receiver._id) {
            return {
              ...convUser,
              userDetails: convUser?.sender,
            };
          } else if (convUser.receiver._id !== user._id) {
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

  return (
    <div className="flex bg-slate-100  overflow-hidden">
      {/* Sidebar component */}
      <SideBar
        explorer={explorer}
        setExplorer={setExplorer}
        conversationUser={conversationUser}
      />
      <section
        className={`${explorer ? "hidden xs:flex w-full" : "flex w-full"} `}
      >
        <Outlet />
        <div
          className={`justify-center items-center flex-col gap-2 bg-bgImg bg-cover bg-center  w-full hidden ${
            !basePath ? "hidden" : "xs:flex"
          }`}
        >
          <p className="text-xl font-bold mt-2 text-primaryGreenOne">
            Select user to send message
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
