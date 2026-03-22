import React from "react";
import Notebooks from "./Notebooks";

const SideNavTop = ({
  selectedNotebook,
  selectedNote,
  notes,
  searchInput,
  setSearchInput,
  searchNotes,
  newNotebookHidden,
  setNewNotebookHidden,
  notebooks,
  onNotebookNavigate,
  onOpenNotebookPicker,
  onOpenNoteNavigate,
}) => {
  return (
    <div id="sideNavTop" className={searchInput ? "sideNavHasSearch" : ""}>
      <div className="side-bar-search">
        <i
          className="fas fa-search icon"
          aria-hidden="true"
        ></i>
        <div className={"input-field"}>
          <div className="searchInputWrap">
            <input
              id={"searchField"}
              placeholder="Search Notes"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            ></input>
          </div>

          {searchInput ? (
            <div id={"searchResDiv"} role="listbox" aria-label="Search results">
              {searchNotes(searchInput)}
            </div>
          ) : null}
        </div>
      </div>
      <Notebooks
        notes={notes}
        selectedNotebook={selectedNotebook}
        selectedNote={selectedNote}
        newNotebookHidden={newNotebookHidden}
        setNewNotebookHidden={setNewNotebookHidden}
        notebooks={notebooks}
        onNotebookNavigate={onNotebookNavigate}
        onOpenNotebookPicker={onOpenNotebookPicker}
        onOpenNoteNavigate={onOpenNoteNavigate}
      />
    </div>
  );
};

export default SideNavTop;
