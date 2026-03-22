import React, { useMemo, useState } from "react";
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

export function NotebookPickerPanel({
  notebooks,
  notes,
  onOpenNotebook,
  onOpenNote,
}) {
  const [hoverKey, setHoverKey] = useState(null);
  const list = useMemo(() => Object.values(notebooks), [notebooks]);

  return (
    <div className="browsePanel browsePanel--notebooks">
      <header className="browsePanelHeader">
        <h2 className="browsePanelTitle">Notebooks</h2>
        <p className="browsePanelSubtitle">
          Open a notebook for its list, or pick a note from the preview. Hover a
          card to see notes.
        </p>
      </header>
      <div className="notebookPickerGrid">
        <div
          className="notebookPickerCardWrap"
          onMouseEnter={() => setHoverKey("all")}
          onMouseLeave={() => setHoverKey(null)}
        >
          <button
            type="button"
            className="notebookPickerCard notebookPickerCard--all"
            onClick={() => onOpenNotebook("All Notes")}
          >
            <span className="notebookPickerCardIcon" aria-hidden="true">
              <i className="far fa-sticky-note" />
            </span>
            <span className="notebookPickerCardName">All notes</span>
            <span className="notebookPickerCardMeta">
              {Object.keys(notes).length} notes
            </span>
          </button>
          {hoverKey === "all" && (
            <div
              className="notebookPreviewPopover"
              role="region"
              aria-label="Notes in All notes"
              onClick={e => e.stopPropagation()}
            >
              <p className="notebookPreviewPopoverTitle">Open a note</p>
              <ul className="notebookPreviewList">
                {notesInScope(notes, "All Notes")
                  .slice(0, 8)
                  .map(n => (
                    <li key={n.id} className="notebookPreviewItem">
                      <button
                        type="button"
                        className="notebookPreviewItemBtn"
                        onClick={() =>
                          onOpenNote(n, { type: "allNotes" })
                        }
                      >
                        <span className="notebookPreviewItemTitle">
                          {n.title}
                        </span>
                        <span className="notebookPreviewItemSnippet">
                          {textPreview(n.content, 72) || "Empty note"}
                        </span>
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {list.map(nb => {
          const key = `nb-${nb.id}`;
          const scoped = notesInScope(notes, nb);
          return (
            <div
              key={nb.id}
              className="notebookPickerCardWrap"
              onMouseEnter={() => setHoverKey(key)}
              onMouseLeave={() => setHoverKey(null)}
            >
              <button
                type="button"
                className="notebookPickerCard"
                onClick={() => onOpenNotebook(nb)}
              >
                <span className="notebookPickerCardIcon" aria-hidden="true">
                  <i className="fas fa-book" />
                </span>
                <span className="notebookPickerCardName">{nb.name}</span>
                <span className="notebookPickerCardMeta">
                  {scoped.length} notes
                </span>
              </button>
              {hoverKey === key && (
                <div
                  className="notebookPreviewPopover"
                  role="region"
                  aria-label={`Notes in ${nb.name}`}
                  onClick={e => e.stopPropagation()}
                >
                  <p className="notebookPreviewPopoverTitle">Open a note</p>
                  <ul className="notebookPreviewList">
                    {scoped.length === 0 ? (
                      <li className="notebookPreviewItem notebookPreviewItem--empty">
                        No notes yet — click the card to open this notebook.
                      </li>
                    ) : (
                      scoped.slice(0, 8).map(n => (
                        <li key={n.id} className="notebookPreviewItem">
                          <button
                            type="button"
                            className="notebookPreviewItemBtn"
                            onClick={() =>
                              onOpenNote(n, { type: "notebook", notebook: nb })
                            }
                          >
                            <span className="notebookPreviewItemTitle">
                              {n.title}
                            </span>
                            <span className="notebookPreviewItemSnippet">
                              {textPreview(n.content, 72) || "Empty note"}
                            </span>
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
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
  const title = selectedNotebook?.name || selectedNotebook || "Notes";
  const list = useMemo(() => {
    if (selectedNotebook === "All Notes") {
      return Object.values(notes);
    }
    return Object.values(notes).filter(
      n => n.notebookId === selectedNotebook?.id
    );
  }, [notes, selectedNotebook]);

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
        {list.map(note => (
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
    </div>
  );
}
