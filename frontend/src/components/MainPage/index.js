import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes, editNote, deleteNote } from "../../store/notes";
import {
  createNotebook,
  getNotebooks,
  editNotebook,
  deleteNotebook,
} from "../../store/notebooks";

import ProfileButton from "../Navigation/ProfileButton";

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

  //date
  const [date, setDate] = useState(new Date());

  //debugging visuals
  // console.log("notes ==========>", notes);
  // console.log("notebooks=======>", notebooks);
  // console.log("mainNote =======>", mainNote);
  // console.log("mainNotebook====>", mainNotebook);
  // console.log("title===========>", title);
  // console.log("Notebook========>", name);

  useEffect(() => dispatch(getNotes(sessionUser.id)), []);
  useEffect(() => dispatch(getNotebooks(sessionUser.id)), []);
  useEffect(() => {}, [
    mainNote,
    mainNoteContent,
    mainNoteTitle,
    mainNotebook,
    date,
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
      await dispatch(createNote(payload));
      // await dispatch(getNotes(sessionUser.id));
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

  //deletes a note
  const handleDelete = async e => {
    await dispatch(deleteNote(mainNote.id));
    createNewNote();
  };
  //deletes a notebook
  const handleDeleteNotebook = async e => {
    await dispatch(deleteNotebook(mainNotebook.id));
    setMainNotebook("All Notes");
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
  };

  //function to sort the notes by the selected notebook
  // one condition for all notes and one condition for specific notebooks
  const sortByNotebookHelper = note => (
    <li
      className="notebookNavListItem"
      key={note.id}
      onClick={() => {
        setMainNote(note);
        setMainNoteTitle(note.title);
        setMainNoteContent(note.content);
        setNewNote(false);
      }}
    >
      {note.title}
      <p id="dateOfNote">{note.content.slice(0, 40)}...</p>
    </li>
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
  const createNewNote = () => {
    setMainNoteTitle("");
    setMainNoteContent("");
    setMainNote("");
    setTitleState("");
    setContentState("");
    setNewNote(true);
  };

  //function to handle dates to display prettier
  //SQL was providing times 6 hours ahead
  //converting from GT to CST

  //changing day and hour in helper function
  const timeConverter = date => {
    const wrongDate = date.split(" ");
    let wrongTime = wrongDate[1].split(":");
    let wrongDay = wrongDate[0].split("-");
    let day = +wrongDay[2];
    let hour = +wrongTime[0] - 6;

    if (hour < 0) {
      hour += 25;
      day -= 1;
    }

    wrongTime[0] = hour.toString();
    wrongDay[2] = day.toString();
    wrongDay = wrongDay.join("-");
    wrongTime = wrongTime.join(":");
    const correctDate = [wrongDay, wrongTime].join(" ");
    return correctDate;
  };

  //function below converts SQL date object to:
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

  return (
    <div id="mainPageContainer">
      <div className="sideNav">
        <div id="profileDiv">
          <ProfileButton user={sessionUser} />
        </div>
        <div id="sideNavTop">
          <ul id="notebookNameList">
            <li
              className="notebookNameListItem"
              onClick={() => {
                setMainNotebook("All Notes");
              }}
            >
              All Notes
            </li>
            {Object.keys(notebooks).map(key => (
              <li
                className="notebookNameListItem"
                key={key}
                onClick={() => {
                  setMainNotebook(notebooks[key]);
                }}
              >
                {notebooks[key].name}
              </li>
            ))}
          </ul>
        </div>
        <div id="sideNavBottom">
          <div>
            <input
              id="newNotebookInput"
              onChange={e => setName(e.target.value)}
              required="required"
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
      <div className="notebookNav">
        <h1>{mainNotebook.name || mainNotebook}</h1>
        <ul id="notebookList">{sortByNotebook(mainNotebook)}</ul>
        <button id="createNoteButton" onClick={createNewNote}>
          Create note
        </button>
        <button id="deleteNotebookButton" onClick={handleDeleteNotebook}>
          Delete notebook
        </button>
      </div>
      <div className="mainNoteArea">
        <form id="noteContainer" onSubmit={handleSubmit}>
          <input
            id="title"
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
          <textarea
            id="textarea"
            onChange={
              newNote
                ? e => setContentState(e.target.value)
                : e => setMainNoteContent(e.target.value)
            }
            value={mainNoteContent ? mainNoteContent : content}
          ></textarea>
          <p id="date">
            Last updated:{" "}
            {mainNote ? prettyDateMaker(mainNote.updatedAt) : mainNote}
          </p>
          <div id="bottomMain">
            <div id="buttons">
              <button id="deleteNoteButton" onClick={handleDelete}>
                Delete
              </button>
              <button id="saveNoteButton" type="submit">
                Save note
              </button>
            </div>
            <p id="whereToSavePrompt">
              {mainNotebook.name ? mainNotebook.name : mainNotebook}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
export default MainPage;

// const notes = useSelector(state => state.notes);
// console.log(notes);
// const [mainTitle, setMainTitle] = useState(Object.values(notes)[0].title);
// const [mainContent, setMainContent] = useState(
//   Object.values(notes)[0].content
// );

// const handleSubmit = async e => {
//   e.preventDefault();
//   const payload = {
//     user_id: sessionUser.id,
//     content,
//     title,
//   };
//   let createdNote = await dispatch(createNote(payload));
// };

// const mainNote = () => {
//   console.log(notes);
//   console.log(mainTitle);
//   console.log(mainContent);
// };

// import { Editor } from "react-draft-wysiwyg";
// import { EditorState } from "draft-js";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import "./MainPage.css";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState } from "draft-js";
// import { createNote } from "../../store/notes";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// function MainPage() {
//   // const noteTypes = useSelector(state => state.note.types);
//   const dispatch = useDispatch();

//   const [editorState, setEditorState] = useState(() =>
//     EditorState.createEmpty()
//   );

//   const thing = "hello";

//   useEffect(async () => {
//     console.log(editorState);
//     // console.log(EditorState);
//     let createdNote = await dispatch(createNote(editorState));
//     console.log(createdNote);
//   }, [editorState]);

//   return (
//     <div id="mainPageContainer">
//       <div className="sideNav"></div>
//       <div className="notebookNav"></div>
//       <div className="mainNoteArea">
//         <div>
//           <Editor
//             style={{
//               backgroundColor: "rgb(46, 45, 45)",
//               border: "1px solid black",
//               padding: "2px",
//               minHeight: "400px",
//             }}
//             editorState={editorState}
//             onEditorStateChange={setEditorState}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
// export default MainPage;
