import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  // const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [authUser, setAuthUser] = useState("");
  const [messageTracker, setMessageTracker] = useState({});
  const [userToChat, setUserToChat] = useState("");
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios("http://localhost:5000/checklogin", {
          withCredentials: true
        });
        if (response.status == 200) {
          setAuthUser(response.data.user);
        }
      } catch (e) {
        console.log(e);
      }
    };
    // checkLoginStatus();
  }, []);
  return <AuthContext.Provider value={{ authUser, setAuthUser, setUserToChat, userToChat, setMessageTracker, messageTracker }}>{children}</AuthContext.Provider>;
};
export default AuthContextProvider;
