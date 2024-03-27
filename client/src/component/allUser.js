import axios from "axios";
import { useContext, useEffect, useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import { AuthContext } from "../context/AuthContext";
const AllUser = ({messageList}) => {
  const { setUserToChat, authUser, setMessageTracker, messageTracker } = useContext(AuthContext);
  const [receivedBy,setReceivedBy] = useState([])
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(()=>{
    const receivedBy = [...new Set(messageTracker[authUser])];
    setReceivedBy(receivedBy);
  },[messageTracker])

  const handleClick = (user) => {
    setSelectedUser(user);
    setUserToChat(user);
    const newArray = receivedBy.filter(item => item !== user);
    setReceivedBy(newArray);
  };

  const allData = async () => {
    try {
      const alluser = await axios.get("http://localhost:5000/alluser", {
        withCredentials: true
      });
      setUsers(alluser?.data?.allUser);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    allData();
  }, []);

  return (
    <>
      {users?.length > 0 && (
        <ListGroup style={{ width: "200px" }}>
          {users.map((user, id) => {
            const hasReceivedMessage = receivedBy?.includes(user);
            return(
            <ListGroup.Item onClick={() => handleClick(user)} active={selectedUser === user} key={id}>
              {authUser === user ? `${user} (you)` : user}
              {hasReceivedMessage && (
            <span style={{ color: "green","font-size":"24px"}}>•</span>
          )}
            </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
};

export default AllUser;
