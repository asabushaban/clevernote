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
  onSearchSelectNotebook,
  onNotebookNavigate,
  onOpenNotebookPicker,
  onOpenNoteNavigate,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const normalize = value => String(value || "").toLowerCase();
  const stripHtml = value =>
    String(value || "")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

  const searchNotes = input => {
    const query = normalize(input);
    const searchableNotes = Object.values(notes);
    const searchableNotebooks = Object.values(notebooks);

    const titleResults = searchableNotes.filter(notes =>
      normalize(notes.title).includes(query)
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
      normalize(note.content).includes(query)
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
        {(() => {
          const plain = stripHtml(note.content);
          const matchIndex = plain.toLowerCase().indexOf(query);
          const start = matchIndex >= 0 ? Math.max(0, matchIndex - 12) : 0;
          const snippet = plain.slice(start, start + 42);
          return `${snippet}${plain.length > start + 42 ? "..." : ""}`;
        })()}
      </div>
    ));

    const notebookResults = searchableNotebooks.filter(notebook =>
      normalize(notebook.name).includes(query)
    );

    const notebooksSection = notebookResults.length ? (
      [
        <div key="search-label-notebooks" id={"searchLabel"}>
          Notebooks...
        </div>,
        ...notebookResults.map(notebook => (
          <div
            key={`search-notebook-${notebook.id}`}
            id={"searchResTitle"}
            onClick={() => {
              dispatch(setSelectedNote(null));
              setSearchInput("");
              onSearchSelectNotebook?.(notebook);
            }}
          >
            {notebook.name}
          </div>
        )),
      ]
    ) : (
      [
        <div key="search-label-notebooks" id={"searchLabel"}>
          Notebooks...
        </div>,
        <div key="search-empty-notebooks" id={"searchLabel"}>
          There are no notebooks with that value
        </div>,
      ]
    );

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
      ...notebooksSection,
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
