import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Logo from "../assets/chat.png";

function Contacts({ contacts, currentUser, changeChat }) {
  const [currUserName, setCurrUserName] = useState(undefined);
  const [currUserImage, setCurrUserImage] = useState(undefined);
  const [currSelected, setCurrSelected] = useState(undefined);

  useEffect(() => {
    if (currentUser) {
      setCurrUserName(currentUser.username);
      setCurrUserImage(currentUser.avatarImage);
    }
  }, [currentUser]);

  const changeCurrChat = (index, contact) => {
    setCurrSelected(index);
    changeChat(contact);
  };

  console.log(contacts, currentUser);

  return (
    <>
      {currUserName && currUserImage && (
        <Container>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>talk</h3>
          </div>
          <div className="contacts-list">
            {contacts?.map((contact, index) => {
              return (
                <div
                  className={`contact ${
                    index === currSelected ? "selected" : ""
                  }`}
                  key={index}
                  onClick={() => changeCurrChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #0F4C75;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
    .selected {
      background-color: #BBE1FA;
    }
  }

  .current-user {
    background-color: #3282B8;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;

export default Contacts;
