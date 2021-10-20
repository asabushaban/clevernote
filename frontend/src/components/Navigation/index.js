import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = <ProfileButton user={sessionUser} />;
  } else {
    sessionLinks = (
      <>
        <NavLink to="/login">Log In</NavLink>
        <NavLink to="/signup">Sign Up</NavLink>
      </>
    );
  }

  return (
<<<<<<< HEAD
    <ul>
      <li>
        <NavLink exact to="/">
          Home
        </NavLink>
        {isLoaded && sessionLinks}
      </li>
    </ul>
=======
    <>
      <ul className="splashNav">
        <li className="navBar">
          <NavLink exact to="/">
            Home
          </NavLink>
          {isLoaded && sessionLinks}
        </li>
      </ul>
    </>
>>>>>>> dbe419051e9a12aeb27de52466e628f8f8a31952
  );
}

export default Navigation;
