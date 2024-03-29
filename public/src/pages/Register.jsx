import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Logo from "../assets/chat.png";
import { registerRoute } from "../utils/APIRoutes";

function Register(props) {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  useEffect(() => {
    if(localStorage.getItem('talk-user')) {
      navigate('/');
    }
  },[]);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, email, password } = user;
      const {data} = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      
      if (data.status === true) {
        localStorage.setItem("talk-user", JSON.stringify(data.user));
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { username, email, password, confirmPassword } = user;

    if (password !== confirmPassword) {
      toast.error(
        "password and confrim password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error("username must have at least 3 char.", toastOptions);
      return false;
    } else if (password.length < 8) {
      toast.error(
        "password should be equal or grather than 8 char.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("email is required.", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => {
      return {
        ...prevUser,
        [name]: value,
      };
    });
  };

  return (
    <>
      <FromContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="Logo" />
            <h1>talk</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>
          </span>
        </form>
      </FromContainer>
      <ToastContainer />
    </>
  );
}

const FromContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #1B262C;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #0F4C75;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input {
      background-color: transparent;
      padding: 1rem;
      border: 0.1rem solid #1B262C;
      border-radius: 0.4rem;
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border: 0.1rem solid #3282B8;
        outline: none;
      }
    }
    button {
      background-color: #1B262C;
      color: white;
      padding: 1rem 2rem;
      border: none;
      font-weight: bold;
      cursor: pointer;
      border-radius: 0.4rem;
      font-size: 1rem;
      text-transform: uppercase;
      transition: 0.5s ease-in-out;
      &:hover {
        background-color: #3282B8;
      }
    }
    span {
      color: white;
      a {
        color: #1B262C;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;

export default Register;
