import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes, editNote, deleteNote } from "../../store/notes";
import {
  getNotebooks,
  editNotebook,
  deleteNotebook,
} from "../../store/notebooks";
import Modal from "../Modal/Modal";
import ReactQuill from "react-quill";
import ReactHtmlParser from "react-html-parser";
import "react-quill/dist/quill.snow.css";
import SideNav from "./SideNav";

function MainPage() {
  const dispatch = useDispatch();

  //subscribed
  const sessionUser = useSelector(state => state.session.user);
  const notes = useSelector(state => state.notes);
  const notebooks = useSelector(state => state.notebooks);

  //New Notes
  const [newNote, setNewNote] = useState(true);
  const [content, setContentState] = useState("");
  const [title, setTitleState] = useState("");

  //Old Notes
  const [mainNote, setMainNote] = useState("");
  const [mainNoteTitle, setMainNoteTitle] = useState("");
  const [mainNoteContent, setMainNoteContent] = useState("");

  //Notebooks
  const [mainNotebook, setMainNotebook] = useState("All Notes");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  const [direction, setDirection] = useState("right");
  const [newNotebookHidden, setNewNotebookHidden] = useState(true);

  //Notebooks error
  const [error, setError] = useState("");

  //Notebook Ellipsis
  const [open, setOpen] = useState(false);

  //Search
  const [searchInput, setSearchInput] = useState("");

  //debugging visuals
  // console.log("notes ==========>", notes);
  // console.log("notebooks=======>", notebooks);
  // console.log("mainNote =======>", mainNote);
  // console.log("mainNotebook====>", mainNotebook);
  // console.log("title===========>", title);
  // console.log("Notebook========>", name);

  useEffect(() => dispatch(getNotes(sessionUser.id)), [dispatch]);
  useEffect(() => dispatch(getNotebooks(sessionUser.id)), [dispatch]);
  useEffect(() => {}, [
    mainNote,
    mainNoteContent,
    mainNoteTitle,
    mainNotebook,
    open,
    searchInput,
  ]);

  //saving a new note or editing an old note
  const handleSubmit = async e => {
    e.preventDefault();
    if (newNote) {
      const payload = {
        userId: sessionUser.id,
        notebookId: mainNotebook.id,
        content,
        title,
      };
      let createdNote = await dispatch(createNote(payload));
      setMainNote(createdNote);
      createNewNote();
      return;
    }
    const editPayload = {
      id: mainNote.id,
      notebookId: mainNotebook.id,
      content: mainNoteContent,
      title: mainNoteTitle,
    };
    await dispatch(editNote(editPayload));
    await dispatch(getNotes(sessionUser.id));
  };

  //editing notebook name

  const editNotebookName = async e => {
    setOpen(!open);
    const editPayload = {
      id: mainNotebook.id,
      name: newName,
    };
    let editedNotebook = await dispatch(editNotebook(editPayload));
    await dispatch(getNotebooks(sessionUser.id));
    setMainNotebook(editedNotebook);
  };

  //deletes a note
  const handleDelete = async e => {
    e.preventDefault();
    const id = mainNote.id;
    setMainNote("");
    await dispatch(deleteNote(id));
    createNewNote();
  };
  //deletes a notebook
  const handleDeleteNotebook = async e => {
    e.preventDefault();
    setOpen(!open);
    await dispatch(deleteNotebook(mainNotebook.id));
    setMainNotebook("All Notes");
  };

  //function to sort the notes by the selected notebook
  // one condition for all notes and one condition for specific notebooks
  const sortByNotebookHelper = note => (
    <div
      className="notebookNavListItem"
      key={note.id}
      onClick={() => {
        setMainNote(note);
        setMainNoteTitle(note.title);
        setMainNoteContent(note.content);
        setNewNote(false);
      }}
      style={{ overflow: "hidden" }}
    >
      <li>{note.title}</li>
      <p id="dateOfNote" style={{ fontSize: "8pt" }}>
        {ReactHtmlParser(prettyDateMaker(note.createdAt).slice(0, 120))}
      </p>
    </div>
  );

  const sortByNotebook = notebook => {
    if (notebook === "All Notes") {
      return Object.values(notes).map(note => sortByNotebookHelper(note));
    } else {
      return Object.values(notes).map(note => {
        if (note.notebookId === mainNotebook.id) {
          return sortByNotebookHelper(note);
        }
      });
    }
  };

  // create new note function updates state to empty strings
  // and provides fresh input fields
  function createNewNote() {
    setMainNoteTitle("");
    setMainNoteContent("");
    setMainNote("");
    setTitleState("");
    setContentState("");
    setNewNote(true);
  }

  //function to handle dates to display prettier
  //SQL was providing times 6 hours ahead
  //converting from GT to CST

  //changing day and hour in helper function
  const timeConverter = date => {
    const wrongDate = date.split(" ");
    let wrongTime = wrongDate[1].split(":");
    let wrongDay = wrongDate[0].split("-");
    let day = +wrongDay[2];
    let hour = +wrongTime[0] - 5;

    if (hour < 0) {
      hour += 24;
      day -= 1;
    }

    wrongTime[0] = hour.toString();
    wrongDay[2] = day.toString();
    wrongDay = wrongDay.join("-");
    wrongTime = wrongTime.join(":");
    const correctDate = [wrongDay, wrongTime].join(" ");
    return correctDate;
  };

  //function converts SQL date object "2000-01-01T12:00:00.786Z"
  //to the format below:
  //Sunday, January 1, 2000, 12:00AM
  function prettyDateMaker(SQLDate) {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    let date = new Date(SQLDate).toISOString().slice(0, 19).replace("T", " ");
    const newDate = timeConverter(date);
    date = new Date(newDate);
    return date.toLocaleDateString("en-US", options);
  }

  //match notebook dates
  const findUpdate = id => prettyDateMaker(notes[id].updatedAt);

  // rich text editing props
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }, "code-block"],
      ["bold", "italic", "underline", "strike"],
      [{ script: "super" }, { script: "sub" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image", "video"],
      ["direction", { align: [] }],
      ["clean"],
    ],
  };

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  return (
    <div id="mainPageContainer">
      <SideNav
        sessionUser={sessionUser}
        notes={notes}
        notebooks={notebooks}
        setNewNote={setNewNote}
        setMainNote={setMainNote}
        setMainNoteTitle={setMainNoteTitle}
        setMainNoteContent={setMainNoteContent}
        mainNotebook={mainNotebook}
        setMainNotebook={setMainNotebook}
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
            {mainNotebook.name || mainNotebook}
          </h1>
          {mainNotebook != "All Notes" ? (
            <h1 id="verticalEllipsis" onClick={() => setOpen(!open)}>
              ???
            </h1>
          ) : (
            ""
          )}
        </div>
        <ul id="notebookList">{sortByNotebook(mainNotebook)}</ul>
        <button id="createNoteButton" onClick={createNewNote}>
          Create note
        </button>
      </div>
      <div className="mainNoteArea">
        <form id="noteContainer">
          <input
            id="title"
            placeholder="Write a title for your note here"
            value={mainNoteTitle ? mainNoteTitle : title}
            onChange={
              newNote
                ? e => setTitleState(e.target.value)
                : e => setMainNoteTitle(e.target.value)
            }
          ></input>
          <p id="date">
            {mainNote ? prettyDateMaker(mainNote.createdAt) : mainNote}
          </p>
          <div style={{ height: "100%" }}>
            <ReactQuill
              toolbarOptions={toolbarOptions}
              modules={modules}
              id="my-form1"
              theme="snow"
              value={newNote === false ? mainNoteContent : content}
              type="text"
              placeholder="What is on your mind?"
              onChange={
                newNote
                  ? value => setContentState(value)
                  : value => setMainNoteContent(value)
              }
            />
          </div>
          <p id="date">
            Last updated: {mainNote != "" ? findUpdate(mainNote.id) : mainNote}{" "}
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
              {mainNotebook.name ? mainNotebook.name : mainNotebook}
            </p>
          </div>
        </form>
      </div>

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
              value={mainNotebook.name}
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
    </div>
  );
}

export default MainPage;
