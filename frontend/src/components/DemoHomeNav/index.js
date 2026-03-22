import React from "react";
import { Link, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import "../SplashPage/SplashPage.css";

function DemoHomeNav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleDemo = async e => {
    e.preventDefault();
    await dispatch(
      sessionActions.login({
        credential: "Demo-lition",
        password: "password",
      })
    ).catch(async res => {
      await res.json();
    });
    history.push("/");
    return;
  };

  return (
    <div className="splashNav">
      <div className="leftNav">
        <button className="uiButton uiButtonGhost splashDemoButton" onClick={handleDemo}>
          Demo
        </button>
        <Link className="loginFromSplashNav" to="/">
          Home
        </Link>
      </div>
      <div className="rightNav"></div>
    </div>
  );
}

export default DemoHomeNav;
