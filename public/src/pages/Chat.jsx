import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Contacts from "../components/Contacts";
import { allUsersRoute } from "../utils/APIRoutes";

function Chat(props) {
    const navigate = useNavigate();

    const [contacts, setContacts] = useState([]);

    const [currentUser, setCurrentUser] = useState(undefined);

    useEffect(() => {
        if(!localStorage.getItem("talk-user")) {
            navigate("/login");
        } else {
            const user = JSON.parse(localStorage.getItem("talk-user"));
            setCurrentUser(user);
        }
    },[]);

    useEffect(() => {
        if(currentUser) {
            if(currentUser.isAvatarImageSet) {
                const data = axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data.data);
            } else {
                navigate("/setAvatar");
            }
        }
    },[currentUser]);

    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} currentUser={currentUser}/>
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
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;