import "./Register.css";
import RoomIcon from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState, useRef } from "react";
import { HOST } from "../App";

import axios from "axios";

function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post(`${HOST}/auth/register`, newUser);
      setError(false);
      setSuccess(true);
    } catch (error) {
      setError(true);
      setSuccess(false);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logo">
        <RoomIcon />
        LamaPin
      </div>
      <form onSubmit={handleSubmit}>
        <input type={"text"} placeholder="Username" ref={nameRef} />
        <input type={"email"} placeholder="Email" ref={emailRef} />
        <input type={"password"} placeholder="Password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
        {success && (
          <span className="success">Successful. You can login now !</span>
        )}
        {error && (
          <span className="failure">Error. Something went wrong ! !</span>
        )}
      </form>
      <CancelIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}

export default Register;
