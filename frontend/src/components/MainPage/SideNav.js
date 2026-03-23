import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./MainPage.css";
import SideNavProfile from "./SideNavProfile";
import SideNavTop from "./SideNavTop";
import { setSelectedNote } from "../../store/selectedNote";
import * as sessionActions from "../../store/session";

const SideNav = ({
  sessionUser,
  notes,
  notebooks,
  selectedNote,
  selectedNotebook,
  searchInput,
  setSearchInput,
  onSearchSelectNote,
  onNotebookNavigate,
  onOpenNotebookPicker,
  onOpenNoteNavigate,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

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
        key={`search-title-${notes.id}`}
        id={"searchResTitle"}
        onClick={() => {
          dispatch(setSelectedNote(notes));
          setSearchInput("");
          onSearchSelectNote?.();
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
        key={`search-body-${note.id}`}
        id={"searchRes"}
        onClick={() => {
          dispatch(setSelectedNote(note));
          setSearchInput("");
          onSearchSelectNote?.();
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
        <div key="search-empty-titles" id={"searchLabel"}>
          There are no titles with that value
        </div>,
      ];
    if (!noteContent.length)
      noteContent = [
        <div key="search-empty-notes" id={"searchLabel"}>
          There are no notes with that value
        </div>,
      ];

    const searchResults = [
      <div key="search-label-titles" id={"searchLabel"}>
        Titles...
      </div>,
      ...titles,
      <div key="search-label-notes" id={"searchLabel"}>
        Notes...
      </div>,
      ...noteContent,
    ];

    return searchResults;
  };

  const logout = e => {
    e.preventDefault();
    history.push("/login");
    dispatch(sessionActions.logout());
  };

  return (
    <div className="sideNav">
      <SideNavProfile sessionUser={sessionUser} />
      <SideNavTop
        notes={notes}
        selectedNote={selectedNote}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        searchNotes={searchNotes}
        notebooks={notebooks}
        selectedNotebook={selectedNotebook}
        onNotebookNavigate={onNotebookNavigate}
        onOpenNotebookPicker={onOpenNotebookPicker}
        onOpenNoteNavigate={onOpenNoteNavigate}
      />
      <div id="sideNavBottom">
        <div className="sideNavBottomInner">
          <button
            type="button"
            className="sideNavSignoutBtn"
            onClick={logout}
          >
            <i className="fas fa-sign-out-alt" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
