import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import "./MainPage.css";
import { createNote, getNotes, editNote, deleteNote } from "../../store/notes";
import { getNotebooks } from "../../store/notebooks";
import SideNav from "./SideNav";
import NoteEditor from "./NoteEditor";
import {
  setSelectedNote,
  updateSelectedNoteContent,
  updateSelectedNoteTitle,
} from "../../store/selectedNote";
import { setSelectedNotebook } from "../../store/selectedNotebook";
import { findUpdate, prettyDateMaker } from "../../helpers";
import NotebookModal from "../Modal";
import {
  NotebookPickerPanel,
  NotesListPanel,
} from "./BrowseWorkspace";

function plainFromHtml(html) {
  if (!html) return "";
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function MainPage() {
  const dispatch = useDispatch();

  const sessionUser = useSelector(state => state.session.user);
  const notes = useSelector(state => state.notes);
  const notebooks = useSelector(state => state.notebooks);
  const selectedNote = useSelector(state => state?.selectedNote);
  const selectedNotebook =
    useSelector(state => state?.selectedNotebook) || "All Notes";

  const [appPhase, setAppPhase] = useState("notebooks");

  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

  const [name, setName] = useState("");

  const [direction, setDirection] = useState("right");
  const [newNotebookHidden, setNewNotebookHidden] = useState(true);

  const [error] = useState("");

  const [open, setOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const [saveStatus, setSaveStatus] = useState("idle");

  const [navPinned, setNavPinned] = useState(false);
  const [navHovered, setNavHovered] = useState(false);
  const navLeaveTimerRef = useRef(null);

  const lastSavedRef = useRef({
    id: null,
    title: "",
    content: "",
  });
  const skipNextAutosaveRef = useRef(false);
  const selectedNoteRef = useRef(selectedNote);
  selectedNoteRef.current = selectedNote;

  const editorNoteKey = selectedNote?.id ?? "new";
  const editorInitialHtml = selectedNote?.content ?? "";

  useEffect(() => {
    dispatch(getNotes(sessionUser.id));
    dispatch(getNotebooks(sessionUser.id));
  }, [dispatch, sessionUser.id]);

  useEffect(() => {
    return () => {
      if (navLeaveTimerRef.current) {
        clearTimeout(navLeaveTimerRef.current);
      }
    };
  }, []);

  const clearNavLeaveTimer = () => {
    if (navLeaveTimerRef.current) {
      clearTimeout(navLeaveTimerRef.current);
      navLeaveTimerRef.current = null;
    }
  };

  const handleNavDockEnter = () => {
    clearNavLeaveTimer();
    setNavHovered(true);
  };

  const handleNavDockLeave = () => {
    if (navPinned) return;
    clearNavLeaveTimer();
    navLeaveTimerRef.current = setTimeout(() => {
      setNavHovered(false);
      navLeaveTimerRef.current = null;
    }, 220);
  };

  const handleHitStripClick = e => {
    e.stopPropagation();
    if (navPinned) {
      setNavPinned(false);
      setNavHovered(false);
      return;
    }
    setNavHovered(h => !h);
  };

  const navExpanded = navPinned || navHovered;

  useEffect(() => {
    skipNextAutosaveRef.current = true;
    if (selectedNote) {
      const t = selectedNote.title || "";
      const c = selectedNote.content || "";
      setNoteTitle(t);
      setNoteContent(c);
      lastSavedRef.current = {
        id: selectedNote.id,
        title: t,
        content: c,
      };
    } else {
      setNoteTitle("");
      setNoteContent("");
      lastSavedRef.current = { id: null, title: "", content: "" };
    }
  }, [selectedNote]);

  const performSave = useCallback(async () => {
    const bodyText = plainFromHtml(noteContent);
    if (!noteTitle.trim() && !bodyText) return;

    const notebookId = selectedNotebook?.id || null;
    const sn = selectedNoteRef.current;
    setSaveStatus("saving");

    try {
      if (!sn) {
        const note = await dispatch(
          createNote({
            userId: sessionUser.id,
            notebookId,
            content: noteContent,
            title: noteTitle,
          })
        );
        if (note) {
          await dispatch(setSelectedNote(note));
          lastSavedRef.current = {
            id: note.id,
            title: noteTitle,
            content: noteContent,
          };
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
        }
        return;
      }

      const ok = await dispatch(
        editNote({
          id: sn.id,
          notebookId,
          content: noteContent,
          title: noteTitle,
        })
      );
      if (ok) {
        dispatch(updateSelectedNoteContent(noteContent));
        dispatch(updateSelectedNoteTitle(noteTitle));
        lastSavedRef.current = {
          id: sn.id,
          title: noteTitle,
          content: noteContent,
        };
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } catch {
      setSaveStatus("error");
    }
  }, [dispatch, noteContent, noteTitle, selectedNotebook, sessionUser.id]);

  useEffect(() => {
    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    const saved = lastSavedRef.current;
    const sid = selectedNote?.id ?? null;
    if (
      saved.title === noteTitle &&
      saved.content === noteContent &&
      saved.id === sid
    ) {
      return;
    }

    if (!noteTitle.trim() && !plainFromHtml(noteContent)) {
      return;
    }

    const t = setTimeout(() => {
      performSave();
    }, 950);
    return () => clearTimeout(t);
  }, [noteTitle, noteContent, selectedNote?.id, performSave]);

  useEffect(() => {
    if (saveStatus !== "saved") return;
    const timer = setTimeout(() => setSaveStatus("idle"), 2200);
    return () => clearTimeout(timer);
  }, [saveStatus]);

  const handleSaveNow = e => {
    e?.preventDefault?.();
    performSave();
  };

  const handleDelete = e => {
    e.preventDefault();
    if (!selectedNote?.id) return;
    dispatch(deleteNote(selectedNote.id));
    dispatch(setSelectedNote(null));
    setNoteContent("");
    setNoteTitle("");
    lastSavedRef.current = { id: null, title: "", content: "" };
    setAppPhase("notes");
  };

  const openNotebook = useCallback(
    nb => {
      dispatch(setSelectedNotebook(nb));
      setAppPhase("notes");
    },
    [dispatch]
  );

  const openNoteInEditor = useCallback(
    note => {
      dispatch(setSelectedNote(note));
      setAppPhase("editor");
    },
    [dispatch]
  );

  const openNoteFromPicker = useCallback(
    (note, ctx) => {
      if (ctx?.type === "allNotes") {
        dispatch(setSelectedNotebook("All Notes"));
      } else if (ctx?.type === "notebook" && ctx.notebook) {
        dispatch(setSelectedNotebook(ctx.notebook));
      }
      dispatch(setSelectedNote(note));
      setAppPhase("editor");
    },
    [dispatch]
  );

  const createNewNote = useCallback(() => {
    dispatch(setSelectedNote(null));
    setNoteContent("");
    setNoteTitle("");
    lastSavedRef.current = { id: null, title: "", content: "" };
    setSaveStatus("idle");
    setAppPhase("editor");
  }, [dispatch]);

  const handleSearchSelectNote = useCallback(() => {
    setAppPhase("editor");
  }, []);

  const handleSidebarNotebookNavigate = useCallback(() => {
    setAppPhase("notes");
  }, []);

  const saveStatusLabel =
    saveStatus === "saving"
      ? "Saving…"
      : saveStatus === "saved"
      ? "Saved"
      : saveStatus === "error"
      ? "Could not save"
      : "Auto-save on";

  const containerClass =
    appPhase === "editor"
      ? "mainPageContainer mainPageContainer--editor"
      : "mainPageContainer mainPageContainer--browse";

  return (
    <div className="mainPageViewRoot">
      <div
        className={`sideNavDock${navExpanded ? " is-expanded" : ""}${
          navPinned ? " is-pinned" : ""
        }`}
      >
        <div
          className="sideNavDockInner"
          onMouseEnter={handleNavDockEnter}
          onMouseLeave={handleNavDockLeave}
        >
          <button
            type="button"
            className="sideNavHitStrip"
            aria-label={
              navPinned
                ? "Unpin and hide navigation"
                : navExpanded
                ? "Hide navigation"
                : "Open navigation"
            }
            aria-expanded={navExpanded}
            title="Hover, tap, or pin to keep navigation open"
            onClick={handleHitStripClick}
          />
          <aside className="sideNavFlyout" aria-label="App navigation">
            <div className="sideNavFlyoutHeader">
              <button
                type="button"
                className={`sideNavPinBtn${navPinned ? " is-active" : ""}`}
                onClick={() => setNavPinned(p => !p)}
                aria-pressed={navPinned}
                title={navPinned ? "Unpin sidebar" : "Pin sidebar open"}
              >
                <i className="fas fa-thumbtack" aria-hidden="true" />
              </button>
            </div>
            <SideNav
              sessionUser={sessionUser}
              notes={notes}
              notebooks={notebooks}
              selectedNote={selectedNote}
              selectedNotebook={selectedNotebook}
              name={name}
              setName={setName}
              direction={direction}
              setDirection={setDirection}
              newNotebookHidden={newNotebookHidden}
              setNewNotebookHidden={setNewNotebookHidden}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSearchSelectNote={handleSearchSelectNote}
              onNotebookNavigate={handleSidebarNotebookNavigate}
            />
          </aside>
        </div>
      </div>

      <div id="mainPageContainer" className={containerClass}>
        <div className="mainWorkspace">
        {appPhase === "notebooks" && (
          <NotebookPickerPanel
            notebooks={notebooks}
            notes={notes}
            onOpenNotebook={openNotebook}
            onOpenNote={openNoteFromPicker}
          />
        )}

        {appPhase === "notes" && (
          <NotesListPanel
            selectedNotebook={selectedNotebook}
            notes={notes}
            selectedNoteId={selectedNote?.id}
            onBack={() => setAppPhase("notebooks")}
            onSelectNote={openNoteInEditor}
            onCreateNote={createNewNote}
            onNotebookMenu={() => setOpen(true)}
          />
        )}

        {appPhase === "editor" && (
          <div className="mainNoteArea mainNoteArea--editorFocus">
            <div id="noteContainer" className="noteContainer--fill">
              <div className="editorFocusTop">
                <button
                  type="button"
                  className="browseBackBtn browseBackBtn--light"
                  onClick={() => setAppPhase("notes")}
                  aria-label="Back to notes list"
                >
                  ← Notes
                </button>
                <span className="editorFocusNotebookLabel">
                  {selectedNotebook?.name || selectedNotebook}
                </span>
              </div>

              <div className="noteTitleRow">
                <input
                  id="title"
                  placeholder="Write a title for your note here"
                  value={noteTitle}
                  onChange={e => setNoteTitle(e.target.value)}
                />
                <span
                  className={`saveStatusPill saveStatusPill--${saveStatus}`}
                  role="status"
                  aria-live="polite"
                >
                  {saveStatusLabel}
                </span>
              </div>
              <p id="date" className="noteMetaLine">
                {selectedNote ? prettyDateMaker(selectedNote?.createdAt) : null}
              </p>

              <div className="noteEditorShell">
                <NoteEditor
                  key={editorNoteKey}
                  initialHtml={editorInitialHtml}
                  onChange={setNoteContent}
                  placeholder="What is on your mind?"
                />
              </div>

              <p id="date" className="noteMetaLine noteMetaLine--footer">
                Last updated:{" "}
                {selectedNote
                  ? findUpdate(selectedNote?.id, notes)
                  : "—"}{" "}
                (local time)
              </p>
              <div id="bottomMain">
                <div id="buttons">
                  <button
                    type="button"
                    id="deleteNoteButton"
                    className="uiButton uiButtonDanger"
                    onClick={handleDelete}
                    disabled={!selectedNote}
                  >
                    Delete
                  </button>
                  <button
                    type="button"
                    id="saveNoteButton"
                    className="uiButton uiButtonGhost"
                    onClick={handleSaveNow}
                  >
                    Save now
                  </button>
                </div>
                <p id="whereToSavePrompt">
                  {selectedNotebook?.name
                    ? selectedNotebook?.name
                    : selectedNotebook}
                </p>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <NotebookModal
        sessionUser={sessionUser}
        open={open}
        setOpen={setOpen}
        error={error}
        selectedNotebook={selectedNotebook}
      />
    </div>
  );
}

export default MainPage;
