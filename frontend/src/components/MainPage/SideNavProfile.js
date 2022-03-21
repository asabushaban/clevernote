import React from "react";

const SideNavProfile = ({ sessionUser }) => {
  return (
    <div id="profileDiv">
      <div style={{ display: "flex" }}>
        <i
          class="fas fa-user-circle"
          aria-hidden="true"
          style={{
            color: "white",
            textAlign: "center",
            fontSize: "25px",
          }}
        ></i>
        <h1
          style={{
            color: "white",
            fontSize: "1.3rem",
            margin: "0px",
            paddingLeft: "10px",
          }}
        >
          {sessionUser.username}
        </h1>
      </div>
    </div>
  );
};

export default SideNavProfile;
