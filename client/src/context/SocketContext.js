import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { AuthContext } from "./AuthContext";
export const SocketContext = createContext("");

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  
  const { authUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
				query: {
					userId:authUser,
				},
			});
      setSocket(socket);
      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
