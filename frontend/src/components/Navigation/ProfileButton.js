import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = e => {
    e.preventDefault();
    history.push("/login");
    dispatch(sessionActions.logout());
  };

  return (
    <div className="profileButton">
      <button id="personButton" onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          <li>{user.username}</li>
          <li>
            {user.email.length > 16
              ? `${user.email.slice(0, 16)}...`
              : user.email}
          </li>
          <li>
            <button className="profileLogoutButton" onClick={logout}>
              Log Out
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileButton;
