import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import * as sessionActions from "../../store/session";
import logo from "./leaf-closeup-on-white-background.jpeg";
import "./SignupForm.css";

function SignupFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  // if (sessionUser) return <Redirect to="/" />;

  const handleSubmit = e => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({ email, username, password })
      ).catch(async res => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <div className="loginBackground">
      <form onSubmit={handleSubmit} className="signupCenter">
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
            id="signupEmail"
            placeholder="Email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            id="signupEmail"
            placeholder="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            id="signupPassword"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          <input
            id="signupPassword"
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <button id="loginButton" type="submit">
          Sign Up
        </button>
        <p className="signupPrompt">Already have an account?</p>
        <Link className="signupLink" to="/login">
          Log in
        </Link>
      </form>
    </div>
  );
}

export default SignupFormPage;
