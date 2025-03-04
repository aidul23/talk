import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";
import { toast } from "react-toastify";

function Chat() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Add loading state for fetching contacts

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("talk-user"));
    if (!user) {
      navigate("/login");
    } else {
      setCurrentUser(user);
      setIsLoaded(true);
    }
  }, [navigate]);

  useEffect(() => {
    if (currentUser) {
      // Establish socket connection when user is set
      socket.current = io(host);

      socket.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
        toast.error("Failed to connect to server. Please try again later.");
      });

      // Emit the add-user event
      socket.current.emit("add-user", currentUser._id);

      // Cleanup socket connection when component unmounts
      return () => {
        socket.current.disconnect();
      };
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        setIsLoading(true);  // Start loading state
        axios
          .get(`${allUsersRoute}/${currentUser._id}`)
          .then((response) => {
            setContacts(response.data);
          })
          .catch((error) => {
            console.error("Error fetching contacts:", error);
            toast.error("Failed to load contacts. Please try again later.");
          })
          .finally(() => {
            setIsLoading(false);  // End loading state
          });
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          changeChat={handleChatChange}
          isLoading={isLoading}  // Pass loading state to Contacts component
        />
        {isLoaded && currentChat === undefined ? (
          <Welcome currentUser={currentUser} />
        ) : (
          <ChatContainer
            currentChat={currentChat}
            currentUser={currentUser}
            socket={socket}
          />
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #bbe1fa;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #1b262c;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
