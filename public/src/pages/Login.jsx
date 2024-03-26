import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Logo from "../assets/chat.png";
import { loginRoute } from "../utils/APIRoutes";

function Login(props) {
  const navigate = useNavigate();

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
    password: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { username, password } = user;
      const {data} = await axios.post(loginRoute, {
        username,
        password,
      });

      console.log(data);

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      
      if (data.status === true) {
        console.log(data.status);
        localStorage.setItem("talk-user", JSON.stringify(data.user));
        console.log(data);
        navigate("/");
      }
    }
  };

  const handleValidation = () => {
    const { username, password } = user;

    if (password === "") {
        toast.error("email and password is required.", toastOptions);
        return false;
    } else if (username.length === "") {
        toast.error("email and password is required.", toastOptions);
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
            min="3"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Login</button>
          <span>
            Don't have an account? <Link to="/register">Register</Link>
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

export default Login;
