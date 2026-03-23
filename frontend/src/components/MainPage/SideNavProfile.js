import React from "react";
import Toggle from "../ThemeToggle";

const SideNavProfile = ({ sessionUser }) => {
  return (
    <div id="profileDiv">
      <div className="profileRow">
        <i
          className="fas fa-user-circle profileIcon"
          aria-hidden="true"
        ></i>
        <h1 className="profileName">
          {sessionUser.username}
        </h1>
        <div className="profileThemeToggleWrap">
          <Toggle compact />
        </div>
      </div>
    </div>
  );
};

export default SideNavProfile;
