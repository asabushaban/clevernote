import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import logo from "./leaf-closeup-on-white-background.jpeg";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = e => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password })).catch(
      async res => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (
    <>
      <div className="loginBackground">
        <form onSubmit={handleSubmit} className="loginCenter">
          <img className="logo" src={logo} />
          <h1>Clevernote</h1>
          <p className="logoHeadline">Remember what matters.</p>
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            <input
              id="loginEmail"
              placeholder="Username or Email"
              type="text"
              value={credential}
              onChange={e => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              id="loginPassword"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button id="loginButton" type="submit">
            Log In
          </button>
          <p className="signupPrompt">Don't have an account?</p>
          <Link className="signupLink" to="/signup">
            Create an account
          </Link>
        </form>
      </div>
    </>
  );
}

export default LoginFormPage;
