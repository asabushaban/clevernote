import React from "react";
import Notebooks from "./Notebooks";

const SideNavTop = ({
  selectedNotebook,
  searchInput,
  setSearchInput,
  searchNotes,
  direction,
  setDirection,
  newNotebookHidden,
  setNewNotebookHidden,
  notebooks,
}) => {
  return (
    <div id="sideNavTop">
      <div className="side-bar-search">
        <i
          className="fas fa-search icon"
          aria-hidden="true"
          style={{ marginLeft: " 25px", marginTop: "12px" }}
        ></i>
        <div className={"input-field"}>
          <div
            style={{
              marginLeft: "40px",
              marginTop: "3px",
              fontSize: "17px",
            }}
          >
            <input
              id={"searchField"}
              placeholder="Search Notes"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            ></input>
          </div>

          {searchInput ? (
            <div id={"searchResDiv"}>{searchNotes(searchInput)}</div>
          ) : null}
        </div>
      </div>
      <Notebooks
        selectedNotebook={selectedNotebook}
        direction={direction}
        setDirection={setDirection}
        newNotebookHidden={newNotebookHidden}
        setNewNotebookHidden={setNewNotebookHidden}
        notebooks={notebooks}
      />
    </div>
  );
};

export default SideNavTop;
