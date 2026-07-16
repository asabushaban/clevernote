import React, { useEffect, useRef, useState } from "react";

let noteNotebookPickerIdCounter = 0;

export default function NoteNotebookPicker({ notebooks, value, onChange }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const listId = useRef(
    `note-notebook-picker-${++noteNotebookPickerIdCounter}`
  ).current;

  const notebookList = Object.values(notebooks || {});
  const selectedNotebook = notebookList.find(nb => nb.id === value) || null;
  const triggerLabel = selectedNotebook ? selectedNotebook.name : "No notebook";

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = event => {
      if (!wrapRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = event => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const selectValue = nextValue => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="noteNotebookPicker" ref={wrapRef}>
      <span className="noteNotebookPickerLabel">Notebook</span>
      <div className="noteNotebookPickerControl">
        <button
          type="button"
          className="noteNotebookPickerTrigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(prev => !prev)}
        >
          <span className="noteNotebookPickerTriggerText">{triggerLabel}</span>
          <span className="noteNotebookPickerChevron" aria-hidden="true" />
        </button>
        {open ? (
          <ul
            id={listId}
            className="noteNotebookPickerMenu"
            role="listbox"
            aria-label="Choose notebook"
          >
            <li role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={value == null}
                className={`noteNotebookPickerOption${
                  value == null ? " is-selected" : ""
                }`}
                onClick={() => selectValue(null)}
              >
                No notebook
              </button>
            </li>
            {notebookList.map(nb => (
              <li key={nb.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={value === nb.id}
                  className={`noteNotebookPickerOption${
                    value === nb.id ? " is-selected" : ""
                  }`}
                  onClick={() => selectValue(nb.id)}
                >
                  {nb.name}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
