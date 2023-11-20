const SELECT_NOTE = "notes/SELECT_NOTE";
const UPDATE_NOTE_TITLE = "notes/UPDATE_NOTE_TITLE";
const UPDATE_NOTE_CONTENT = "notes/UPDATE_NOTE_CONTENT";

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

export const setSelectedNote = note => async dispatch => {
  dispatch(selectNote(note));
};

export const updateSelectedNoteContent = noteContent => async dispatch => {
  dispatch(updateNoteContent(noteContent));
};

export const updateSelectedNoteTitle = noteTitle => async dispatch => {
  dispatch(updateNoteTitle(noteTitle));
};

const initialState = null;

const selectNoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_NOTE: {
      state = action.note;
      return state;
    }
    case UPDATE_NOTE_CONTENT: {
      const newState = { ...state, content: action.noteContent };
      return newState;
    }
    case UPDATE_NOTE_TITLE: {
      const newState = { ...state, title: action.noteTitle };
      return newState;
    }
    default:
      return state;
  }
};

export default selectNoteReducer;
