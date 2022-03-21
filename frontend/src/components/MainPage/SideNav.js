import React from "react";
import { useDispatch } from "react-redux";
import "./MainPage.css";
import { createNotebook } from "../../store/notebooks";
import SideNavProfile from "./SideNavProfile";
import SideNavTop from "./SideNavTop";

const SideNav = ({
  sessionUser,
  notes,
  notebooks,
  setNewNote,
  setMainNote,
  setMainNoteTitle,
  setMainNoteContent,
  mainNotebook,
  setMainNotebook,
  name,
  setName,
  direction,
  setDirection,
  newNotebookHidden,
  setNewNotebookHidden,
  searchInput,
  setSearchInput,
}) => {
  const dispatch = useDispatch();

  //functions to list all notebooks/notes or specific notebooks/notes on search

  // const searchNotebooks = input => {
  //   const searchableNotebooks = Object.values(notebooks);
  //   return searchableNotebooks.filter(notebook =>
  //     notebook.name.toLowerCase().includes(input.toLowerCase())
  //   );
  // };

  const searchNotes = input => {
    const searchableNotes = Object.values(notes);
    let res = searchableNotes.filter(notes =>
      notes.title.toLowerCase().includes(input.toLowerCase())
    );
    return res.map(notes => (
      <div
        id={"searchRes"}
        onClick={() => {
          setMainNote(notes);
          setMainNoteTitle(notes.title);
          setMainNoteContent(notes.content);
          setNewNote(false);
          setSearchInput("");
        }}
      >
        {notes.title}
      </div>
    ));
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
    setNewNotebookHidden(true);
    setName("");
  };

  return (
    <div className="sideNav">
      <SideNavProfile sessionUser={sessionUser} />
      <SideNavTop
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchNotes={searchNotes}
        setMainNotebook={setMainNotebook}
        direction={direction}
        setDirection={setDirection}
        newNotebookHidden={newNotebookHidden}
        setNewNotebookHidden={setNewNotebookHidden}
        notebooks={notebooks}
        mainNotebook={mainNotebook}
      />
      <div id="sideNavBottom">
        <div hidden={newNotebookHidden}>
          <input
            id="newNotebookInput"
            onChange={e => setName(e.target.value)}
            required="required"
            value={name}
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
  );
};

export default SideNav;
