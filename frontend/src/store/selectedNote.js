const SELECT_NOTE = "notes/SELECT_NOTE";
const UPDATE_NOTE_TITLE = "notes/UPDATE_NOTE_TITLE";
const UPDATE_NOTE_CONTENT = "notes/UPDATE_NOTE_CONTENT";
const UPDATE_NOTE_NOTEBOOK_ID = "notes/UPDATE_NOTE_NOTEBOOK_ID";

const selectNote = note => ({
  type: SELECT_NOTE,
  note,
});

const updateNoteContent = noteContent => ({
  type: UPDATE_NOTE_CONTENT,
  noteContent,
});

const updateNoteTitle = noteTitle => ({
  type: UPDATE_NOTE_TITLE,
  noteTitle,
});

const updateNoteNotebookId = (noteId, notebookId) => ({
  type: UPDATE_NOTE_NOTEBOOK_ID,
  noteId,
  notebookId,
});

export const setSelectedNote = note => async dispatch => {
  dispatch(selectNote(note));
};

export const updateSelectedNoteContent = noteContent => async dispatch => {
  dispatch(updateNoteContent(noteContent));
};

export const updateSelectedNoteTitle = noteTitle => async dispatch => {
  dispatch(updateNoteTitle(noteTitle));
};

export const updateSelectedNoteNotebookId = (noteId, notebookId) => async dispatch => {
  dispatch(updateNoteNotebookId(noteId, notebookId));
};

const initialState = null;

const selectNoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_NOTE: {
      state = action.note;
      return state;
    }
    case UPDATE_NOTE_CONTENT: {
      if (!state) return state;
      return { ...state, content: action.noteContent };
    }
    case UPDATE_NOTE_TITLE: {
      if (!state) return state;
      return { ...state, title: action.noteTitle };
    }
    case UPDATE_NOTE_NOTEBOOK_ID: {
      if (!state || state.id !== action.noteId) return state;
      return { ...state, notebookId: action.notebookId };
    }
    default:
      return state;
  }
};

export default selectNoteReducer;
