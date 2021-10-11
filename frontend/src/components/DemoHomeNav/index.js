import React, { useState } from "react";
import Navigation from "../Navigation";
import { useHistory, Link } from "react-router-dom";

function DemoHomeNav() {
  return (
    <div className="splashNav">
      <div id="leftNav">
        <button id="demoButton">Demo</button>
        <Link className="loginFromSplashNav" to="/">
          Home
        </Link>
      </div>
      <div id="rightNav"></div>
    </div>
  );
}

export default DemoHomeNav;
