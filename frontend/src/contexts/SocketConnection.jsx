import { createContext, useState } from "react";

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socketConnection, setSocketConnection] = useState(null);

  return (
    <SocketContext.Provider value={{ socketConnection, setSocketConnection }}>
      {children}
    </SocketContext.Provider>
  );
}
