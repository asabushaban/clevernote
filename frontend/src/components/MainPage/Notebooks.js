import React from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const Notebooks = ({
  setMainNotebook,
  direction,
  setDirection,
  newNotebookHidden,
  setNewNotebookHidden,
  notebooks,
  mainNotebook,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

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

  const logout = e => {
    e.preventDefault();
    history.push("/login");
    dispatch(sessionActions.logout());
  };

  return (
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
          direction === "right" ? setDirection("down") : setDirection("right")
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
  );
};

export default Notebooks;
