import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import DemoHomeNav from "../DemoHomeNav";
import logo from "./leaf-closeup-on-white-background.jpeg";
import "./LoginForm.css";

function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors([]);
    let saveError;
    await dispatch(sessionActions.login({ credential, password })).catch(
      async res => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
          saveError = data.errors;
        }
      }
    );
    if (!saveError) history.push("/");
    return;
  };

  return (
    <>
      <div className="loginBackground">
        <DemoHomeNav />
        <form onSubmit={handleSubmit} className="loginCenter glassPanel authCard">
          <img className="logo" src={logo} alt="Clevernote logo" />
          <h1 className="authHeading">Clevernote</h1>
          <p className="logoHeadline">A clone of evernote.</p>
          <ul className="authErrors">
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label>
            <input
              className="authInput"
              placeholder="Username or Email"
              type="text"
              value={credential}
              onChange={e => setCredential(e.target.value)}
              required
            />
          </label>
          <label>
            <input
              className="authInput"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>
          <button className="uiButton uiButtonPrimary authSubmitButton" type="submit">
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
