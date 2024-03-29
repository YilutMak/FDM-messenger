
import "./Login.css";
import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { useUser } from "../../context/UserContext";
import logo from "../../assets/smileyLogo.png";
import { useNavigation } from "../../context/NavigationContext";

const Login = () => {
  const User = useUser()
  const isLoggedIn = User.userIsAuthenticated()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { navagate } = useNavigation();

  const formValidation = () => {
    // Check all inputs
    if (!username || !password) {
      // setErrorMessage("Please provide username and password")
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValidation()) return;

    try {
      const response = await loginUser(username, password)
      const { user_id, email, firstname, lastname, initials } = response
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { user_id, email, username, firstname, lastname, initials, authdata }

      User.userLogin(authenticatedUser)


      setUsername('')
      setPassword('')

    } catch (error) {
      // handleLogError(error)
      // setErrorMessage(error.response.data.message)
    }
  };

    if (isLoggedIn) {
      navagate("profile")
      return <Navigate to={'/'} />
  }

  return (
    <div className="container">
      <div className="login-wrapper">
        <div className="logo" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <img src={logo} alt="Logo" style={{ height: "40px", width: "auto" }} />
          <span className="logo-text" style={{ fontWeight: "bolder" }}>Fluent Dialogue Messenger</span>
        </div>
        <div className="login-box">
          <h2 className="title">Login to use FDM!</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="button-container">
              <button className="button" type="submit">Login</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
