import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect } from "react-router-dom";
import "./MainPage.css";
// import { Editor } from "react-draft-wysiwyg";
// import { EditorState } from "draft-js";
import { createNote } from "../../store/notes";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MainPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const [content, setContentState] = useState("");
  const [title, setTitleState] = useState("");

  // if (sessionUser) {
  //   if (params.userId != sessionUser.id) {
  //     return <Redirect to={`/`} />;
  //   }
  // }

  if (!sessionUser || params.userId != sessionUser.id)
    return <Redirect to={`/`} />;

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
      <div className="notebookNav"></div>
      <div className="mainNoteArea">
        <form id="noteContainer" onSubmit={handleSubmit}>
          <input
            id="title"
            placeholder="Title"
            onChange={e => setTitleState(e.target.value)}
          ></input>
          <textarea
            id="textarea"
            onChange={e => setContentState(e.target.value)}
          ></textarea>
          <button id="createNoteButton" type="submit">
            Create note
          </button>
        </form>
      </div>
    </div>
  );
}
export default MainPage;

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
