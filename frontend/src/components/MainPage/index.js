import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes } from "../../store/notes";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MainPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const notes = useSelector(state => state.notes);
  const [content, setContentState] = useState("");
  const [title, setTitleState] = useState("");
  const [mainNote, setMainNote] = useState("");
  const [mainNoteTitle, setMainNoteTitle] = useState("");
  const [mainNoteContent, setMainNoteContent] = useState("");

  useEffect(() => {
    dispatch(getNotes(sessionUser.id));
    // setMainNote(notes["1"]);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      user_id: sessionUser.id,
      content,
      title,
    };
    let createdNote = await dispatch(createNote(payload));
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
            value={mainNoteTitle ? mainNoteTitle : "Title"}
            onChange={e => setMainNoteTitle(e.target.value)}
          ></input>
          <textarea
            id="textarea"
            onChange={e => setMainNoteContent(e.target.value)}
            value={mainNoteContent ? mainNoteContent : "Note"}
          ></textarea>
          <button id="createNoteButton" type="submit">
            Save note
          </button>
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
