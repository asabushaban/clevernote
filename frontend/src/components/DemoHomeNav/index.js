import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";

function DemoHomeNav() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [errors, setErrors] = useState([]);

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
    <div className="splashNav">
      <div id="leftNav">
        <button id="demoButton" onClick={handleDemo}>
          Demo
        </button>
        <Link className="loginFromSplashNav" to="/">
          Home
        </Link>
      </div>
      <div id="rightNav"></div>
    </div>
  );
}

export default DemoHomeNav;
