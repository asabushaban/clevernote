import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes, editNote, deleteNote } from "../../store/notes";
import { getNotebooks } from "../../store/notebooks";
import ReactQuill from "react-quill";
import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";
import SideNav from "./SideNav";
import { modules, toolbarOptions } from "../../constans";
import {
  setSelectedNote,
  updateSelectedNoteContent,
  updateSelectedNoteTitle,
} from "../../store/selectedNote";
import { prettyDateMaker, findUpdate } from "../../helpers";
import NotebookModal from "../Modal";

function MainPage() {
  const dispatch = useDispatch();

  //Subscribed
  const sessionUser = useSelector(state => state.session.user);
  const notes = useSelector(state => state.notes);
  const notebooks = useSelector(state => state.notebooks);
  const selectedNote = useSelector(state => state?.selectedNote);
  const selectedNotebook =
    useSelector(state => state?.selectedNotebook) || "All Notes";

  //Active note
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  //Notebooks
  const [name, setName] = useState("");

  const [direction, setDirection] = useState("right");
  const [newNotebookHidden, setNewNotebookHidden] = useState(true);

  //Notebooks error
  const [error, setError] = useState("");

  //Notebook Ellipsis
  const [open, setOpen] = useState(false);

  //Search
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    dispatch(getNotes(sessionUser.id));
    dispatch(getNotebooks(sessionUser.id));
  }, [dispatch]);

  useEffect(() => {
    if (selectedNote) {
      setNoteContent(selectedNote.content);
      setNoteTitle(selectedNote.title);
    }
  }, [selectedNote]);

  //saving a new note or editing an old note
  const handleSubmit = async e => {
    e.preventDefault();
    if (!selectedNote) {
      const payload = {
        userId: sessionUser.id,
        notebookId: selectedNotebook?.id || null,
        content: noteContent,
        title: noteTitle,
      };
      dispatch(createNote(payload));
      createNewNote();
      return;
    }
    const editPayload = {
      id: selectedNote.id,
      notebookId: selectedNotebook?.id || null,
      content: noteContent,
      title: noteTitle,
    };
    dispatch(editNote(editPayload));
    dispatch(updateSelectedNoteContent(noteContent));
    dispatch(updateSelectedNoteTitle(noteTitle));
  };

  //deletes a note
  const handleDelete = async e => {
    e.preventDefault();
    const id = selectedNote.id;
    dispatch(deleteNote(id));
    createNewNote();
  };

  //function to sort the notes by the selected notebook
  // one condition for all notes and one condition for specific notebooks
  const sortByNotebookHelper = note => (
    <div
      className="notebookNavListItem"
      key={note.id}
      onClick={() => {
        dispatch(setSelectedNote(note));
      }}
      style={{ overflow: "hidden" }}
    >
      <li>{note.title}</li>
      <p id="dateOfNote" style={{ fontSize: "8pt" }}>
        {ReactHtmlParser(prettyDateMaker(note?.createdAt).slice(0, 120))}
      </p>
    </div>
  );

  const sortByNotebook = notebook => {
    if (notebook === "All Notes") {
      return Object.values(notes).map(note => sortByNotebookHelper(note));
    } else {
      return Object.values(notes).map(note => {
        if (note.notebookId === selectedNotebook?.id) {
          return sortByNotebookHelper(note);
        }
      });
    }
  };

  // create new note function updates state to empty strings
  // and provides fresh input fields
  function createNewNote() {
    dispatch(setSelectedNote(null));
    setNoteContent("");
    setNoteTitle("");
  }

  return (
    <div id="mainPageContainer">
      <SideNav
        sessionUser={sessionUser}
        notes={notes}
        notebooks={notebooks}
        selectedNote={selectedNote}
        selectedNotebook={selectedNotebook}
        name={name}
        setName={setName}
        direction={direction}
        setDirection={setDirection}
        newNotebookHidden={newNotebookHidden}
        setNewNotebookHidden={setNewNotebookHidden}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
      />
      <div className="notebookNav">
        <div id="notebookNavTop">
          <h1 id="notebookNavTopHeading">
            {selectedNotebook?.name || selectedNotebook}
          </h1>
          {selectedNotebook != "All Notes" ? (
            <h1 id="verticalEllipsis" onClick={() => setOpen(!open)}>
              ⋮
            </h1>
          ) : (
            ""
          )}
        </div>
        <ul id="notebookList">{sortByNotebook(selectedNotebook)}</ul>
        <button id="createNoteButton" onClick={createNewNote}>
          Create note
        </button>
      </div>
      <div className="mainNoteArea">
        <form id="noteContainer">
          <input
            id="title"
            placeholder="Write a title for your note here"
            value={noteTitle}
            onChange={e => setNoteTitle(e.target.value)}
          ></input>
          <p id="date">
            {selectedNote
              ? prettyDateMaker(selectedNote?.createdAt)
              : selectedNote}
          </p>
          <div style={{ height: "100%" }}>
            <ReactQuill
              toolbarOptions={toolbarOptions}
              modules={modules}
              id="my-form1"
              theme="snow"
              value={noteContent}
              type="text"
              placeholder="What is on your mind?"
              onChange={value => setNoteContent(value)}
            />
          </div>
          <p id="date">
            Last updated:{" "}
            {selectedNote != ""
              ? findUpdate(selectedNote?.id, notes)
              : selectedNote}{" "}
            (CDT)
          </p>
          <div id="bottomMain">
            <div id="buttons">
              <button id="deleteNoteButton" onClick={handleDelete}>
                Delete
              </button>
              <button id="saveNoteButton" onClick={handleSubmit}>
                Save note
              </button>
            </div>
            <p id="whereToSavePrompt">
              {selectedNotebook?.name
                ? selectedNotebook?.name
                : selectedNotebook}
            </p>
          </div>
        </form>
      </div>

      <NotebookModal
        sessionUser={sessionUser}
        open={open}
        setOpen={setOpen}
        error={error}
        selectedNotebook={selectedNotebook}
      />
    </div>
  );
}

export default MainPage;
