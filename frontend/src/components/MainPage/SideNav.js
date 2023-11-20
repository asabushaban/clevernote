import React from "react";
import { useDispatch } from "react-redux";
import "./MainPage.css";
import { createNotebook } from "../../store/notebooks";
import SideNavProfile from "./SideNavProfile";
import SideNavTop from "./SideNavTop";
import { setSelectedNote } from "../../store/selectedNote";

const SideNav = ({
  sessionUser,
  notes,
  notebooks,
  selectedNotebook,
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

    const titleResults = searchableNotes.filter(notes =>
      notes.title.toLowerCase().includes(input.toLowerCase())
    );

    let titles = titleResults.map(notes => (
      <div
        id={"searchResTitle"}
        onClick={() => {
          dispatch(setSelectedNote(notes));
          setSearchInput("");
        }}
      >
        {notes.title}
      </div>
    ));

    const noteResults = searchableNotes.filter(note =>
      note.content.toLowerCase().includes(input.toLowerCase())
    );

    let noteContent = noteResults.map(note => (
      <div
        id={"searchRes"}
        onClick={() => {
          dispatch(setSelectedNote(note));
          setSearchInput("");
        }}
      >
        {note.content
          .replace(/(<([^>]+)>)/gi, "")
          .slice(
            note.content
              .toLowerCase()
              .replace(/(<([^>]+)>)/gi, "")
              .indexOf(input.toLowerCase())
          )
          .slice(0, 30) + "..."}
      </div>
    ));

    if (!titles.length)
      titles = [
        <div id={"searchLabel"}>There are no titles with that value</div>,
      ];
    if (!noteContent.length)
      noteContent = [
        <div id={"searchLabel"}>There are no notes with that value</div>,
      ];

    const searchResults = [
      <div id={"searchLabel"}>Titles...</div>,
      ...titles,
      <div id={"searchLabel"}>Notes...</div>,
      ...noteContent,
    ];

    return searchResults;
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
        direction={direction}
        setDirection={setDirection}
        newNotebookHidden={newNotebookHidden}
        setNewNotebookHidden={setNewNotebookHidden}
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
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
