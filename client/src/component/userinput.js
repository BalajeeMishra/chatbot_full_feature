import axios from "axios";
import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { AuthContext } from "../context/AuthContext";
function InputModal() {
  const { authUser } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);
  const save = async () => {
    await axios.post(
      "http://localhost:5000/login",
      {
        userName: userName
      },
      {
        withCredentials: true
      }
    );
    setShow(false);
  };

  return (
    <>
      {!authUser && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
              <Form.Control
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </InputGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={save}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default InputModal;
