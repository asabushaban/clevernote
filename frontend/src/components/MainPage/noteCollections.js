export const ALL_NOTES = "All Notes";
export const NO_NOTEBOOK = "No Notebook";

export function notesInCollection(notes, collection) {
  const allNotes = Object.values(notes || {});

  if (collection === ALL_NOTES) return allNotes;
  if (collection === NO_NOTEBOOK) {
    return allNotes.filter(note => note.notebookId == null);
  }
  if (collection?.id != null) {
    return allNotes.filter(note => note.notebookId === collection.id);
  }

  return [];
}

export function isVirtualCollection(collection) {
  return collection === ALL_NOTES || collection === NO_NOTEBOOK;
}

export function collectionLabel(collection) {
  if (collection === ALL_NOTES) return "All notes";
  if (collection === NO_NOTEBOOK) return "No notebook";
  return collection?.name || "Notes";
}

export function notebookIdForCollection(collection) {
  return isVirtualCollection(collection) ? null : collection?.id ?? null;
}
