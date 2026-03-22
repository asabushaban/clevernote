import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setSelectedNote } from "../../store/selectedNote";
import { setSelectedNotebook } from "../../store/selectedNotebook";

const Notebooks = ({
  notes,
  notebooks,
  newNotebookHidden,
  setNewNotebookHidden,
  selectedNote,
  onOpenNotebookPicker,
  onOpenNoteNavigate,
}) => {
  const dispatch = useDispatch();
  const allNotes = useMemo(
    () =>
      Object.values(notes).sort(
        (a, b) =>
          new Date(b?.updatedAt || b?.createdAt) -
          new Date(a?.updatedAt || a?.createdAt)
      ),
    [notes]
  );

  const recentNotes = allNotes.slice(0, 5);

  const suggestedNotes = useMemo(() => {
    if (!allNotes.length) return [];

    const tokenize = text =>
      String(text || "")
        .toLowerCase()
        .replace(/<[^>]+>/g, " ")
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(token => token.length > 2);

    const baseTokens = new Set(
      tokenize(selectedNote?.title).concat(tokenize(selectedNote?.content)).slice(0, 28)
    );

    const scored = allNotes
      .filter(note => note.id !== selectedNote?.id)
      .map(note => {
        const noteTokens = tokenize(note.title).concat(tokenize(note.content));
        const overlap = noteTokens.reduce(
          (acc, token) => acc + (baseTokens.has(token) ? 1 : 0),
          0
        );
        const ageDays =
          (Date.now() - new Date(note?.updatedAt || note?.createdAt).getTime()) /
          86400000;
        const recencyScore = Math.max(0, 8 - ageDays);
        const sameNotebookBonus =
          selectedNote && note.notebookId === selectedNote.notebookId ? 3 : 0;
        const score = overlap * 4 + recencyScore + sameNotebookBonus;
        return { note, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(x => x.note);

    if (selectedNote && scored.length) return scored.slice(0, 5);
    return allNotes.slice(1, 6);
  }, [allNotes, selectedNote]);

  const notebookById = useMemo(() => {
    const map = new Map();
    Object.values(notebooks || {}).forEach(nb => map.set(nb.id, nb));
    return map;
  }, [notebooks]);

  const openNoteFromSidebar = note => {
    const parentNotebook = notebookById.get(note.notebookId);
    if (parentNotebook) dispatch(setSelectedNotebook(parentNotebook));
    dispatch(setSelectedNote(note));
    onOpenNoteNavigate?.();
  };

  return (
    <ul id="notebookNameList">
      <div
        id={"notebookNameListDiv"}
        className="navListRow sideNavPrimaryLink"
        onClick={() => onOpenNotebookPicker?.()}
      >
        <i className="fas fa-book-open" aria-hidden="true"></i>
        <li id={"notbookNavTab"}>Notebooks</li>
      </div>

      <div className="sideNavSectionLabel">Recent notes</div>
      <div className="sideNavNoteList">
        {recentNotes.length ? (
          recentNotes.map(note => (
            <li
              key={`recent-${note.id}`}
              className="sideNavNoteItem"
              onClick={() => openNoteFromSidebar(note)}
            >
              <span className="sideNavNoteTitle">{note.title || "Untitled note"}</span>
            </li>
          ))
        ) : (
          <li className="sideNavNoteItem sideNavNoteItemMuted">No recent notes</li>
        )}
      </div>

      <div className="sideNavSectionLabel">Suggested notes</div>
      <div className="sideNavNoteList">
        {suggestedNotes.length ? (
          suggestedNotes.map(note => (
            <li
              key={`suggested-${note.id}`}
              className="sideNavNoteItem sideNavNoteItemSuggested"
              onClick={() => openNoteFromSidebar(note)}
            >
              <span className="sideNavNoteTitle">{note.title || "Untitled note"}</span>
            </li>
          ))
        ) : (
          <li className="sideNavNoteItem sideNavNoteItemMuted">No suggestions yet</li>
        )}
      </div>

      <div className="sideNavNotebookActions">
        <button
          type="button"
          className="uiButton uiButtonGhost sideNavNotebookActionBtn"
          onClick={() =>
            !newNotebookHidden
              ? setNewNotebookHidden(true)
              : setNewNotebookHidden(false)
          }
        >
          Add notebook
        </button>
      </div>
    </ul>
  );
};

export default Notebooks;
