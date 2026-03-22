import React, { useEffect, useMemo, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import { prettyDateMaker } from "../../helpers";

function textPreview(html, max = 96) {
  if (!html) return "";
  const t = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return t.length > max ? `${t.slice(0, max)}…` : t;
}

function notesInScope(notes, notebook) {
  const all = Object.values(notes);
  if (notebook === "All Notes") return all;
  if (!notebook?.id) return all;
  return all.filter(n => n.notebookId === notebook.id);
}

function sortNotesByUpdated(list) {
  return [...list].sort(
    (a, b) => new Date(b?.updatedAt || b?.createdAt) - new Date(a?.updatedAt || a?.createdAt)
  );
}

export function NotebookPickerPanel({
  notebooks,
  notes,
  onOpenNotebook,
  onOpenNote,
}) {
  const [expandedKey, setExpandedKey] = useState(null);
  const [activePreviewNoteByKey, setActivePreviewNoteByKey] = useState({});
  const [previewContext, setPreviewContext] = useState(null);
  const list = useMemo(() => Object.values(notebooks), [notebooks]);

  const togglePreview = ({ key, openCtx, scoped }) => {
    if (expandedKey === key) {
      setExpandedKey(null);
      setPreviewContext(null);
      return;
    }
    setExpandedKey(key);
    setPreviewContext({
      key,
      openCtx,
      scoped,
      label:
        openCtx?.type === "allNotes"
          ? "All notes"
          : openCtx?.notebook?.name || "Notebook",
    });
  };

  const renderPreviewPanel = context => {
    if (!context) return null;
    const { key, scoped, openCtx, label } = context;
    const sorted = sortNotesByUpdated(scoped);
    const firstNoteId = sorted[0]?.id || null;
    const activeNoteId = activePreviewNoteByKey[key] || firstNoteId;
    const activeNote =
      sorted.find(n => n.id === activeNoteId) || sorted[0] || null;

    const onHoverNote = note => {
      setActivePreviewNoteByKey(prev => ({ ...prev, [key]: note.id }));
    };

    return (
      <div
        className="notebookPreviewPanel"
        role="region"
        aria-label={`Preview notes in ${label}`}
      >
        <div className="notebookPreviewPanelHeader">
          <p className="notebookPreviewPopoverTitle">
            {sorted.length} note{sorted.length === 1 ? "" : "s"} in this notebook
          </p>
          <button
            type="button"
            className="uiButton uiButtonGhost notebookPreviewOpenNotebookBtn"
            onClick={() =>
              onOpenNotebook(
                openCtx?.type === "allNotes" ? "All Notes" : openCtx?.notebook
              )
            }
          >
            Open notebook
          </button>
        </div>
        {sorted.length === 0 ? (
          <div className="notebookPreviewEmpty">
            No notes yet - create one inside this notebook.
          </div>
        ) : (
          <div className="notebookPreviewLayout">
            <ul className="notebookPreviewList notebookPreviewList--left">
              {sorted.map(n => (
                <li key={n.id} className="notebookPreviewItem">
                  <button
                    type="button"
                    className={`notebookPreviewItemBtn${
                      n.id === activeNote?.id ? " is-active" : ""
                    }`}
                    onMouseEnter={() => onHoverNote(n)}
                    onFocus={() => onHoverNote(n)}
                    onClick={() => onOpenNote(n, openCtx)}
                  >
                    <span className="notebookPreviewItemTitle">{n.title}</span>
                    <span className="notebookPreviewItemSnippet">
                      {textPreview(n.content, 54) || "Empty note"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="notebookPreviewFocus">
              <h4 className="notebookPreviewFocusTitle">
                {activeNote?.title || "Untitled note"}
              </h4>
              <p className="notebookPreviewFocusSnippet">
                {textPreview(activeNote?.content, 5000) || "This note is empty."}
              </p>
              <button
                type="button"
                className="uiButton uiButtonPrimary notebookPreviewOpenBtn"
                onClick={() => activeNote && onOpenNote(activeNote, openCtx)}
              >
                Open note
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="browsePanel browsePanel--notebooks">
      <header className="browsePanelHeader">
        <h2 className="browsePanelTitle">Notebooks</h2>
        <p className="browsePanelSubtitle">
          Open a notebook for its list, or use preview to jump directly to a
          note.
        </p>
      </header>
      <div className="notebookPickerGrid">
        <div className="notebookPickerCardWrap">
          <button
            type="button"
            className="notebookPickerCard notebookPickerCard--all"
            onClick={() =>
              togglePreview({
                key: "all",
                openCtx: { type: "allNotes" },
                scoped: notesInScope(notes, "All Notes"),
              })
            }
          >
            <span className="notebookPickerCardIcon" aria-hidden="true">
              <i className="far fa-sticky-note" />
            </span>
            <span className="notebookPickerCardName">All notes</span>
            <span className="notebookPickerCardMeta">
              {Object.keys(notes).length} notes
            </span>
          </button>
        </div>

        {list.map(nb => {
          const key = `nb-${nb.id}`;
          const scoped = notesInScope(notes, nb);
          return (
            <div key={nb.id} className="notebookPickerCardWrap">
              <button
                type="button"
                className="notebookPickerCard"
                onClick={() =>
                  togglePreview({
                    key,
                    openCtx: { type: "notebook", notebook: nb },
                    scoped,
                  })
                }
              >
                <span className="notebookPickerCardIcon" aria-hidden="true">
                  <i className="fas fa-book" />
                </span>
                <span className="notebookPickerCardName">{nb.name}</span>
                <span className="notebookPickerCardMeta">
                  {scoped.length} notes
                </span>
              </button>
            </div>
          );
        })}
      </div>
      {previewContext ? (
        <div className="notebookPreviewStage">
          {renderPreviewPanel(previewContext)}
        </div>
      ) : null}
    </div>
  );
}

export function NotesListPanel({
  selectedNotebook,
  notes,
  selectedNoteId,
  onBack,
  onSelectNote,
  onCreateNote,
  onNotebookMenu,
}) {
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const title = selectedNotebook?.name || selectedNotebook || "Notes";
  const list = useMemo(() => {
    if (selectedNotebook === "All Notes") {
      return sortNotesByUpdated(Object.values(notes));
    }
    return sortNotesByUpdated(Object.values(notes).filter(
      n => n.notebookId === selectedNotebook?.id
    ));
  }, [notes, selectedNotebook]);

  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const pageItems = list.slice(start, start + pageSize);

  useEffect(() => {
    setPage(1);
  }, [selectedNotebook]);

  return (
    <div className="browsePanel browsePanel--notes">
      <header className="browsePanelHeader browsePanelHeader--row">
        <button
          type="button"
          className="browseBackBtn"
          onClick={onBack}
          aria-label="Back to notebooks"
        >
          ←
        </button>
        <div className="browsePanelHeaderText">
          <h2 className="browsePanelTitle">{title}</h2>
          <p className="browsePanelSubtitle">
            {list.length} note{list.length === 1 ? "" : "s"}
          </p>
        </div>
        {selectedNotebook !== "All Notes" ? (
          <button
            type="button"
            className="browseNotebookMenuBtn"
            aria-label="Notebook options"
            onClick={onNotebookMenu}
          >
            ⋮
          </button>
        ) : (
          <span className="browseNotebookMenuSpacer" />
        )}
      </header>

      <button
        type="button"
        className="uiButton uiButtonPrimary browseNewNoteBtn"
        onClick={onCreateNote}
      >
        New note
      </button>

      <ul className="notesBrowseList">
        {pageItems.map(note => (
          <li key={note.id}>
            <button
              type="button"
              className={`notesBrowseRow${
                selectedNoteId === note.id ? " notesBrowseRow--active" : ""
              }`}
              onClick={() => onSelectNote(note)}
            >
              <span className="notesBrowseRowTitle">{note.title}</span>
              <span className="notesBrowseRowSnippet">
                {textPreview(note.content, 120) || "Empty note"}
              </span>
              <span className="notesBrowseRowDate">
                {ReactHtmlParser(prettyDateMaker(note?.createdAt).slice(0, 80))}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <div className="notesBrowsePagination">
        <button
          type="button"
          className="uiButton uiButtonGhost notesPageBtn"
          disabled={currentPage <= 1}
          onClick={() => setPage(p => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <span className="notesPageInfo">
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          className="uiButton uiButtonGhost notesPageBtn"
          disabled={currentPage >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
