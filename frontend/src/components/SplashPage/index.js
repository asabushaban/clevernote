import React, { useState } from "react";
import Navigation from "../Navigation";
import { useHistory } from "react-router-dom";
import "./SplashPage.css";

function SplashPage({ isLoaded }) {
  let history = useHistory();

  function SignupButton() {
    history.push("/signup");
  }

  return (
    <>
      <div id="splashContainer">
        <Navigation isLoaded={isLoaded} className="splashNav" />
        <div className="headingWithSignupLink">
          <h1>Jot down a memory, or a note to your future self</h1>
          <button
            id="signupFromSplashButton"
            type="button"
            onClick={SignupButton}
          >
            Sign up for free
          </button>
        </div>
        {/* <div className=""></div>
        <div className=""></div> */}
      </div>
    </>
  );
}
export default SplashPage;
