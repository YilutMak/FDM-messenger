
import "./Login.css";
import React, { useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/userService";
import { useUser } from "../../context/UserContext";


const Login = () => {
  const User = useUser()
  const isLoggedIn = User.userIsAuthenticated()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

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
      const { id, email, name, firstname, lastname, initials } = response.data
      const authdata = window.btoa(username + ':' + password)
      const authenticatedUser = { id, email, name, firstname, lastname, initials, authdata }

      User.userLogin(authenticatedUser)

      setUsername('')
      setPassword('')
      navigate('/')
    } catch (error) {
      // handleLogError(error)
      // setErrorMessage(error.response.data.message)
    }
  };

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <div className="container">
      <div className="login-wrapper">
        <div className="logo">
          <img src="./smileyLogo.png" alt="Logo" />
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