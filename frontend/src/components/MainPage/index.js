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

  console.log("mainNote =======>", mainNote);
  console.log("notes ==========>", notes);
  console.log("notebooks=======>", notebooks);
  console.log("title===========>", title);
  console.log("Notebook========>", name);

  useEffect(() => dispatch(getNotes(sessionUser.id)), []);
  useEffect(() => dispatch(getNotebooks(sessionUser.id)), []);

  useEffect(() => {}, [mainNote, mainNoteContent, mainNoteTitle]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newNote) {
      const payload = {
        userId: sessionUser.id,
        content,
        title,
      };
      let createdNote = await dispatch(createNote(payload));
      // await dispatch(getNotes(sessionUser.id));
      return;
    }
    const editPayload = {
      id: mainNote.id,
      content: mainNoteContent,
      title: mainNoteTitle,
    };
    let editedNote = await dispatch(editNote(editPayload));
    await dispatch(getNotes(sessionUser.id));
    // let createdNote = await dispatch(createNote(payload));
  };

  const createNewNote = () => {
    setMainNoteTitle("");
    setMainNoteContent("");
    setMainNote("");
    setTitleState("");
    setContentState("");
    setNewNote(true);
  };

  const handleDelete = async e => {
    await dispatch(deleteNote(mainNote.id));
    createNewNote();
  };

  const handleNewNotebookSubmit = async e => {
    e.preventDefault();

    const payload = {
      userId: sessionUser.id,
      name,
    };

    await dispatch(createNotebook(payload));
  };

  return (
    <div id="mainPageContainer">
      <div className="sideNav">
        <div id="sideNavTop">
          {/* <p id="createNotebookPrompt"> Create New Notebook</p> */}
          {/* <form onSubmit={handleNewNotebookSubmit}>
            <input
              id="newNotebookInput"
              onChange={e => setName(e.target.value)}
              required="required"
            ></input>
            <button id="newNotebookButton" type="submit">
              +
            </button>
          </form> */}
          <ul id="notebookNameList">
            {Object.keys(notebooks).map(key => (
              <li
                className="notebookNameListItem"
                key={key}
                onClick={() => {
                  setMainNotebook(notebooks[key].name);
                }}
              >
                {notebooks[key].name}
              </li>
            ))}
          </ul>
        </div>
        <div id="sideNavBottom">
          <form onSubmit={handleNewNotebookSubmit}>
            <input
              id="newNotebookInput"
              onChange={e => setName(e.target.value)}
              required="required"
            ></input>
            <button id="newNotebookButton" type="submit">
              +
            </button>
          </form>
        </div>
      </div>
      <div className="notebookNav">
        <h1>{mainNotebook}</h1>
        <ul id="notebookList">
          {/* <form>
            <input></input>
            <button></button>
          </form> */}
          {Object.entries(notes).map(note => (
            <li
              className="notebookNavListItem"
              key={note[0]}
              onClick={() => {
                setMainNote(notes[note[0]]);
                setMainNoteTitle(notes[note[0]].title);
                setMainNoteContent(notes[note[0]].content);
                setNewNote(false);
              }}
            >
              {note[1].title}
              <p id="dateOfNote">{note[1].updatedAt.slice(0, 10)}</p>
            </li>
          ))}
        </ul>
        <button id="createNoteButton" onClick={createNewNote}>
          Create note
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
          <textarea
            id="textarea"
            onChange={
              newNote
                ? e => setContentState(e.target.value)
                : e => setMainNoteContent(e.target.value)
            }
            value={mainNoteContent ? mainNoteContent : content}
          ></textarea>
          <div id="buttons">
            <button id="saveNoteButton" type="submit">
              Save note
            </button>
            <button id="deleteNoteButton" onClick={handleDelete}>
              Delete note
            </button>
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
