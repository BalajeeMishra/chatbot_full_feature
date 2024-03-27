import { useState, useEffect, useContext } from "react";
// import { ThemeContext } from "./context/ThemeContext";
import { SocketContext } from "./context/SocketContext";
// import io from "socket.io-client";
import "./chat.css";
// import axios from "axios";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import AllUser from "./component/allUser";
import { AuthContext } from "./context/AuthContext";

const Chat = () => {
  // const { theme, toggleTheme } = useContext(ThemeContext);
  const { userToChat, authUser, setMessageTracker } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState("");

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", ({ sender, message }) => {
        setMessageList((prevMessageList) => [...prevMessageList, { role: "receiver", message: message, sender: sender }]);
        setMessageTracker((prevState) => ({
          ...prevState,
          [authUser]: [...(prevState[authUser] || []), sender]
        }));
      });
      return () => socket.off();
    }
  }, [socket]);

  const submitHandler = () => {
    setMessageList((prevMessageList) => [...prevMessageList, { role: "sender", message: message, receiver: userToChat }]);
    socket.emit("sendMessage", { authUser, userToChat, message });
    setMessage("");
  };
  return (
    <>
      <div className="d-flex flex-row m-5">
        <AllUser messageList={messageList} />

        <div className="chatBox">
          {messageList.length > 0 &&
            userToChat &&
            messageList.map((e, i) => {
              if (e?.sender == userToChat) {
                return (
                  <div key={i} className={e.role === "sender" ? "chatbox_sender" : "chatbox_receiver"}>
                    {e.message}
                  </div>
                );
              } else if (e.receiver == userToChat) {
                return (
                  <div key={i} className={e.role === "sender" ? "chatbox_sender" : "chatbox_receiver"}>
                    {e.message}
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>

      <div className="input-container d-flex mb-2">
        <InputGroup >
          <Form.Control aria-describedby="basic-addon1" placeholder="Type your message.." value={message} onChange={(e) => setMessage(e.target.value)} />
        </InputGroup>
        <Button variant="primary ml-3" onClick={submitHandler}>
          Send{" "}
        </Button>
      </div>
          
          {/* <Button variant="primary ml-3" className="mb-5" onClick={submitHandler}>
          Send{" "}
        </Button> */}
      

      {/* {toggleTheme && (
  <>
    <p>Current Theme: {theme?"light":"dark"}</p>
    <button onClick={toggleTheme}>Toggle Theme</button>
  </>
)} */}
    </>
  );
};

export default Chat;
