import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import loader from "../assets/loading.gif";

function SetAvatar() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("talk-user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const setProfilePicture = async () => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("talk-user"));

      // Set the default avatar (in case the user hasn't uploaded a custom one)
      const avatarImage = user.avatarImage || "public/public/profile-avatar.png";

      // Here, you can proceed to save the user's avatar (which will be the default image).
      // Update the user in your database with the avatarImage (this can be skipped if you're not uploading).

      user.avatarImage = avatarImage; // Set default avatar
      localStorage.setItem("talk-user", JSON.stringify(user));

      navigate("/"); // Redirect to chat page
    } catch (error) {
      console.log("Error setting avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loading" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Select an Avatar</h1>
          </div>
          <div className="avatar-upload">
            <img
              src={user?.avatarImage || "/default-avatar.png"}
              alt="avatar preview"
              className="avatar-preview"
            />
          </div>
          <button className="submit-btn" onClick={setProfilePicture}>
            Set Profile Picture
          </button>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #0F4C75;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatar-upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    .avatar-preview {
      max-width: 150px;
      max-height: 150px;
      border-radius: 50%;
    }
  }

  .submit-btn {
    background-color: #3282B8;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #1B262C;
    }
  }
`;

export default SetAvatar;
