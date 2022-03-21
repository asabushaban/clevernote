import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./MainPage.css";
import * as sessionActions from "../../store/session";
import { createNotebook } from "../../store/notebooks";
import SideNavProfile from "./SideNavProfile";

const SideNav = ({
  sessionUser,
  notes,
  notebooks,
  setNewNote,
  setMainNote,
  setMainNoteTitle,
  setMainNoteContent,
  mainNotebook,
  setMainNotebook,
  name,
  setName,
  direction,
  setDirection,
  newNotebookHidden,
  setNewNotebookHidden,
  searchInput,
  setSearchInput,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  //functions to list all notebooks/notes or specific notebooks/notes on search

  // const searchNotebooks = input => {
  //   const searchableNotebooks = Object.values(notebooks);
  //   return searchableNotebooks.filter(notebook =>
  //     notebook.name.toLowerCase().includes(input.toLowerCase())
  //   );
  // };

  const searchNotes = input => {
    const searchableNotes = Object.values(notes);
    let res = searchableNotes.filter(notes =>
      notes.title.toLowerCase().includes(input.toLowerCase())
    );
    return res.map(notes => (
      <div
        id={"searchRes"}
        onClick={() => {
          setMainNote(notes);
          setMainNoteTitle(notes.title);
          setMainNoteContent(notes.content);
          setNewNote(false);
          setSearchInput("");
        }}
      >
        {notes.title}
      </div>
    ));
  };

  // sidenav notebook dropdown triangle
  const directionHelper = direction => (direction === "right" ? true : false);

  // function below returns the notebooks in the sidenav dropdown
  // and a different color text
  // if the notebook listed is the main notebook

  const notebookListColor = key => {
    if (notebooks[key] === mainNotebook) {
      return (
        <li
          className="notebookNameListItem"
          key={key}
          style={{ color: "#00a82d" }}
          hidden={directionHelper(direction)}
          onClick={() => setMainNotebook(notebooks[key])}
        >
          {notebooks[key].name}
        </li>
      );
    } else {
      return (
        <li
          className="notebookNameListItem"
          key={key}
          hidden={directionHelper(direction)}
          onClick={() => setMainNotebook(notebooks[key])}
        >
          {notebooks[key].name}
        </li>
      );
    }
  };

  // function to logout
  const logout = e => {
    e.preventDefault();
    history.push("/login");
    dispatch(sessionActions.logout());
  };

  //creates new notebooks
  const handleNewNotebookSubmit = async e => {
    e.preventDefault();
    if (name === "") return;
    const payload = {
      userId: sessionUser.id,
      name,
    };
    await dispatch(createNotebook(payload));
    setNewNotebookHidden(true);
    setName("");
  };

  return (
    <div className="sideNav">
      <SideNavProfile sessionUser={sessionUser} />
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
        <ul id="notebookNameList">
          <div
            id={"allNotesNameListDiv"}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "8px",
            }}
          >
            <i
              class="far fa-sticky-note"
              aria-hidden="true"
              style={{
                paddingRight: "8px",
                paddingTop: "20px",
              }}
            ></i>
            <li
              className="notesNameListItem"
              onClick={() => {
                setMainNotebook("All Notes");
              }}
            >
              All Notes
            </li>
          </div>
          <div
            id={"notebookNameListDiv"}
            style={{
              display: "flex",
              alignItems: "center",
              paddingLeft: "8px",
            }}
            onClick={e =>
              direction === "right"
                ? setDirection("down")
                : setDirection("right")
            }
          >
            <i
              class={`fas fa-caret-${direction}`}
              style={{
                paddingRight: "8px",
                paddingTop: "20px",
                paddingLeft: "3px",
              }}
            ></i>
            <li id={"notbookNavTab"}>Notebooks</li>
          </div>
          <div hidden={directionHelper(direction)}>
            {Object.keys(notebooks).map(key => notebookListColor(key))}
            <li
              className="notebookNameListItem"
              hidden={directionHelper(direction)}
              style={{ color: "#00a82d" }}
              onClick={() =>
                !newNotebookHidden
                  ? setNewNotebookHidden(true)
                  : setNewNotebookHidden(false)
              }
            >
              {"Add Notebook ⨁"}
            </li>
          </div>
          <div
            id={"signoutNavIcon"}
            style={{
              display: "flex",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <i
              className="fas fa-sign-out-alt"
              aria-hidden="true"
              onClick={logout}
              style={{
                paddingTop: "20px",
                paddingRight: "8px",
                paddingLeft: "10px",
              }}
            ></i>
            <li id={"signoutNavTab"} onClick={logout}>
              Sign out
            </li>
          </div>
        </ul>
      </div>
      <div id="sideNavBottom">
        <div hidden={newNotebookHidden}>
          <input
            id="newNotebookInput"
            onChange={e => setName(e.target.value)}
            required="required"
            value={name}
          ></input>
          <button
            id="newNotebookButton"
            type="submit"
            onClick={handleNewNotebookSubmit}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
