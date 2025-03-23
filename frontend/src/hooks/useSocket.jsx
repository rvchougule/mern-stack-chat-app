import { useContext } from "react";
import { SocketContext } from "../contexts/SocketConnection";

const useSocket = () => {
  return useContext(SocketContext);
};

export default useSocket;
