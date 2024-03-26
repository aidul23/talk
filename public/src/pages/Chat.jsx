import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";

function Chat(props) {
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("talk-user")) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("talk-user"));
      setCurrentUser(user);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if(currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  },[currentUser])

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAvatarImageSet) {
        axios
          .get(`${allUsersRoute}/${currentUser._id}`)
          .then((response) => {
            console.log("data", response.data);
            setContacts(response.data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        navigate("/setAvatar");
      }
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <Container>
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          />
          {
            isLoaded && currentChat === undefined ? (
              <Welcome currentUser={currentUser} />
            ) : ( 
              <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>
            )
          }
        </div>
      </Container>
    </>
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
  background-color: #BBE1FA;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #1B262C;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
