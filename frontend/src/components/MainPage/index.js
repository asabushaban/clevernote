import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes, editNote, deleteNote } from "../../store/notes";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MainPage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const notes = useSelector(state => state.notes);
  const [content, setContentState] = useState("");
  const [title, setTitleState] = useState("");
  const [newNote, setNewNote] = useState(true);
  const [mainNote, setMainNote] = useState("");
  const [mainNoteTitle, setMainNoteTitle] = useState("");
  const [mainNoteContent, setMainNoteContent] = useState("");

  console.log(mainNote);
  console.log(notes);
  console.log(title);

  useEffect(() => {
    dispatch(getNotes(sessionUser.id));
    // setMainNote(notes["1"]);
  }, []);

  useEffect(() => {}, [mainNote, mainNoteContent, mainNoteTitle]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (newNote) {
      const payload = {
        user_id: sessionUser.id,
        content,
        title,
      };
      let createdNote = await dispatch(createNote(payload));
      await dispatch(getNotes(sessionUser.id));
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

  const handleDelete = async e => {
    await dispatch(deleteNote(mainNote.id));
    setMainNoteTitle("");
    setMainNoteContent("");
    setMainNote("");
    setTitleState("");
    setContentState("");
    setNewNote(true);
  };

  return (
    <div id="mainPageContainer">
      <div className="sideNav"></div>
      <div className="notebookNav">
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
            <button id="createNoteButton" type="submit">
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
