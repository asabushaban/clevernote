import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
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
    dispatch(sessionActions.logout());
  };

  return (
<<<<<<< HEAD
    <>
      <button onClick={openMenu}>
=======
    <div className="profileButton">
      <button id="personButton" onClick={openMenu}>
>>>>>>> dbe419051e9a12aeb27de52466e628f8f8a31952
        <i className="fas fa-user-circle" />
      </button>
      {showMenu && (
        <ul className="profile-dropdown">
          <li>{user.username}</li>
<<<<<<< HEAD
          <li>{user.email}</li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
    </>
=======
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
>>>>>>> dbe419051e9a12aeb27de52466e628f8f8a31952
  );
}

export default ProfileButton;
