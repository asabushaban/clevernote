import React from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setSelectedNotebook } from "../../store/selectedNotebook";

const Notebooks = ({
  direction,
  setDirection,
  newNotebookHidden,
  setNewNotebookHidden,
  notebooks,
  selectedNotebook,
  onNotebookNavigate,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  // sidenav notebook dropdown triangle
  const directionHelper = direction => (direction === "right" ? true : false);

  // function below returns the notebooks in the sidenav dropdown
  // and a different color text
  // if the notebook listed is the main notebook
  const notebookListColor = key => {
    if (notebooks[key] === selectedNotebook) {
      return (
        <li
          className="notebookNameListItem notebookNameListItemActive"
          key={key}
          hidden={directionHelper(direction)}
          onClick={() => {
            dispatch(setSelectedNotebook(notebooks[key]));
            onNotebookNavigate?.();
          }}
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
          onClick={() => {
            dispatch(setSelectedNotebook(notebooks[key]));
            onNotebookNavigate?.();
          }}
        >
          {notebooks[key].name}
        </li>
      );
    }
  };

  const logout = e => {
    e.preventDefault();
    history.push("/login");
    dispatch(sessionActions.logout());
  };

  return (
    <ul id="notebookNameList">
      <div id={"allNotesNameListDiv"} className="navListRow">
        <i
          className="far fa-sticky-note"
          aria-hidden="true"
        ></i>
        <li
          className="notesNameListItem"
          onClick={() => {
            dispatch(setSelectedNotebook("All Notes"));
            onNotebookNavigate?.();
          }}
        >
          All Notes
        </li>
      </div>
      <div
        id={"notebookNameListDiv"}
        className="navListRow"
        onClick={() =>
          direction === "right" ? setDirection("down") : setDirection("right")
        }
      >
        <i
          className={`fas fa-caret-${direction}`}
        ></i>
        <li id={"notbookNavTab"}>Notebooks</li>
      </div>
      <div hidden={directionHelper(direction)}>
        {Object.keys(notebooks).map(key => notebookListColor(key))}
        <li
          className="notebookNameListItem"
          hidden={directionHelper(direction)}
          id="addNotebookTrigger"
          onClick={() =>
            !newNotebookHidden
              ? setNewNotebookHidden(true)
              : setNewNotebookHidden(false)
          }
        >
          {"Add Notebook ⨁"}
        </li>
      </div>
      <div id={"signoutNavIcon"}>
        <i
          className="fas fa-sign-out-alt"
          aria-hidden="true"
          onClick={logout}
        ></i>
        <li id={"signoutNavTab"} onClick={logout}>
          Sign out
        </li>
      </div>
    </ul>
  );
};

export default Notebooks;
