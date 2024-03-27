import Chat from "./chat";
import SocketProvider from "./context/SocketContext";
import AuthContextProvider from "./context/AuthContext";
import InputModel from "./component/userinput";
import { ThemeContext } from "./context/ThemeContext";
import "./style.css";
import React from "react";

function App() {
  const { theme, toggleTheme } = React.useContext(ThemeContext);
  return (
    <AuthContextProvider>
      <SocketProvider>
        <div className={theme ? "dark" : "light"}>
          <div onClick={toggleTheme}>
            change
          </div>
          <InputModel />
          <Chat />
        </div>
      </SocketProvider>
    </AuthContextProvider>
  );
}

export default App;
