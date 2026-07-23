import {
  ALL_NOTES,
  NO_NOTEBOOK,
  collectionLabel,
  isVirtualCollection,
  notebookIdForCollection,
  notesInCollection,
} from "./noteCollections";

const notes = {
  1: { id: 1, notebookId: 10 },
  2: { id: 2, notebookId: null },
  3: { id: 3 },
  4: { id: 4, notebookId: 20 },
};

test("All notes contains every note regardless of assignment", () => {
  expect(notesInCollection(notes, ALL_NOTES).map(note => note.id)).toEqual([
    1, 2, 3, 4,
  ]);
});

test("No notebook contains only unassigned notes", () => {
  expect(notesInCollection(notes, NO_NOTEBOOK).map(note => note.id)).toEqual([
    2, 3,
  ]);
});

test("real notebooks contain only their assigned notes", () => {
  expect(notesInCollection(notes, { id: 10, name: "Work" })).toEqual([
    notes[1],
  ]);
});

test("virtual collections are labeled as views and create unassigned notes", () => {
  expect(isVirtualCollection(ALL_NOTES)).toBe(true);
  expect(isVirtualCollection(NO_NOTEBOOK)).toBe(true);
  expect(collectionLabel(ALL_NOTES)).toBe("All notes");
  expect(collectionLabel(NO_NOTEBOOK)).toBe("No notebook");
  expect(notebookIdForCollection(ALL_NOTES)).toBeNull();
  expect(notebookIdForCollection(NO_NOTEBOOK)).toBeNull();
  expect(notebookIdForCollection({ id: 10 })).toBe(10);
});
