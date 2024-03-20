import React, { Component, useEffect,useContext } from "react";
import "./Main.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";
import { useChat } from '../../context/ChatContext'
import { Socket } from "socket.io-client";
import { useState } from "react";
import Friends from "../../components/Friends/Friends";
import Profile from "../../components/Profile/Profile";
import { useUser } from "../../context/UserContext";
import { Navigate } from "react-router-dom";

export default function Main() {
  const User = useUser();
  const isLoggedIn = User.userIsAuthenticated();

  const { connectPersonalChannel , socket} = useChat();
  const [activeComponent, setActiveComponent] = useState("chat");

  useEffect(() => {
    connectPersonalChannel();
  }, []);

  useEffect(() => {
    console.log("main socket:", socket);
  }, [socket]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  const handleNavbarItemClick = (component) => {
    setActiveComponent(component);
  };
  return (
    <div className="App d-flex min-vh-100">
      <div
        className="container-fluid flex-grow-1"
        style={{ paddingLeft: "15px" }}
      >
        <div className="row h-100">
          <div
            className="col-2 d-flex flex-column p-0"
            style={{ width: "350px" }}
          >
            <Navbar onNavbarItemClick={handleNavbarItemClick} />
            <Sidebar />

          </div>
          <div
            className="col flex-grow-1 d-flex flex-column p-0"
            style={{ height: "100vh" }}
          >
            {activeComponent === "chat" && <Chat />}
            {activeComponent === "profile" && <Profile />}
            {activeComponent === "friends" && <Friends />}
          </div>
        </div>
      </div>
    </div>
  );
}
