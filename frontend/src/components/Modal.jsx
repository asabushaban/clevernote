import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editNotebook, getNotebooks, deleteNotebook } from "../store/notebooks";
import { setSelectedNotebook } from "../store/selectedNotebook";
import Modal from "./Modal/Modal";

function NotebookModal({
  sessionUser,
  open,
  setOpen,
  error,
  selectedNotebook,
}) {
  const dispatch = useDispatch();
  const [newName, setNewName] = useState(selectedNotebook?.name);

  useEffect(() => {
    setNewName(selectedNotebook.name);
  }, [selectedNotebook]);

  //editing notebook name
  const editNotebookName = async e => {
    setOpen(!open);
    const editPayload = {
      id: selectedNotebook?.id || null,
      name: newName,
    };
    dispatch(editNotebook(editPayload));
    dispatch(getNotebooks(sessionUser.id));
  };

  //deletes a notebook
  const handleDeleteNotebook = async e => {
    e.preventDefault();
    setOpen(!open);
    dispatch(deleteNotebook(selectedNotebook?.id));
    dispatch(setSelectedNotebook("All Notes"));
  };

  return (
    <Modal
      title={sessionUser.username}
      show={open}
      onClose={() => setOpen(false)}
    >
      <div id={"editNotebookModal"}>
        <p id={"editNotebookName"}>{"Edit Notebook Name"}</p>
        {error ? (
          <p style={{ color: "red", textAlign: "center", margin: "0px" }}>
            {error}
          </p>
        ) : null}
        <form id="dropDownAlign" onSubmit={editNotebookName}>
          <input
            id={"editNotebookInput"}
            value={newName}
            type="search"
            placeholder="New notebook name.."
            required
            onChange={e => setNewName(e.target.value)}
          ></input>
          <div id={"editNotebookModalBottom"}>
            <button id={"editNotebookButton"} type="submit">
              Edit
            </button>
            <button
              id={"editNotebookButton"}
              style={{ backgroundColor: "red" }}
              onClick={handleDeleteNotebook}
            >
              Delete
            </button>
          </div>
          <p id={"editNotebookModalCancel"} onClick={() => setOpen(false)}>
            Cancel
          </p>
        </form>
      </div>
    </Modal>
  );
}

export default NotebookModal;
