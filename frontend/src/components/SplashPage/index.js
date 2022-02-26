import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import Navigation from "../Navigation";
import { useHistory, Link } from "react-router-dom";
import logo from "./leaf-closeup-on-white-background.jpeg";
import placeholder from "./placeholder-splash.png";
import "./SplashPage.css";

function SplashPage() {
  let history = useHistory();
  const [errors, setErrors] = useState([]);

  const dispatch = useDispatch();

  function SignupButton() {
    history.push("/signup");
  }

  setTimeout(event => {
    const body = document.querySelector("body");
    const nav = document.querySelector(".splashNav");
    body.onscroll = function () {
      nav.style.boxShadow = "0px 2px 5px rgba(0, 0, 0, 0.125)";
    };
  }, 100);

  const handleDemo = async e => {
    e.preventDefault();
    setErrors([]);
    await dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).catch(async res => {
      const data = await res.json();
      if (data && data.errors) setErrors(data.errors);
    });
    history.push("/");
    return;
  };

  return (
    <>
      <div className="navAndSplashMainContainer">
        <div className="splashNav">
          <div id="leftNav">
            <button id="demoButton" onClick={handleDemo}>
              Demo
            </button>
            <Link className="loginFromSplashNav" to="/login">
              Log in
            </Link>
          </div>

          <div id="rightNav">
            <h3>Clevernote</h3>
            <img className="logoSplash" src={logo} />
          </div>
        </div>
        <div id="splashContainer">
          <div className="headingWithSignupLink">
            <h1 id="splashMainText">
              Jot down a memory or a note to your future self
            </h1>
            <h2>
              Research shows people forget fifty percent of information in an
              hour, seventy percent within twenty-four hours, and ninety percent
              within a week.
            </h2>
            <button
              id="signupFromSplashButton"
              type="button"
              onClick={SignupButton}
            >
              Sign up for free
            </button>
            <Link className="loginFromSplash" to="/login">
              Already have and account? Log in
            </Link>
          </div>
          <div className="secondSectionSplash">
            <img className="secondSectionImage" src={placeholder} />
            <ul className="secondSectionText">
              <li>
                <h4>WORK ANYWHERE</h4>
                <p>
                  Keep important info handy—your notes are editable and can be
                  saved to different notebooks.
                </p>
              </li>
              <li>
                <h4>ORGANIZE EVERYTHING</h4>
                <p>
                  Make notes more useful by grouping notes within notebooks.
                </p>
              </li>
              <li>
                <h4>TURN TO-DO INTO DONE</h4>
                <p>
                  Bring your notes, tasks, and schedules together to get things
                  done more easily.
                </p>
              </li>
              <li>
                <h4>FIND THINGS FAST</h4>
                <p>
                  Your notes are timestamped by created date as well as updated
                  date and sorted from most to least recently updated.
                </p>
              </li>
            </ul>
          </div>
          <div id="footer">
            <div id="innerFooter">
              <h4>Designed by: AJ Abushaban</h4>
              <Link
                to={{
                  pathname: "https://github.com/asabushaban",
                }}
                target="_blank"
              >
                <img
                  id="github"
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                />
              </Link>
              <Link
                to={{
                  pathname:
                    "https://www.linkedin.com/in/aj-abushaban-919231100/",
                }}
                target="_blank"
              >
                <img
                  id="linkedin"
                  src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original-wordmark.svg"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SplashPage;
