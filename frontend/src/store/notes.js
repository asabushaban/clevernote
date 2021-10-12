import { csrfFetch } from "./csrf";

const ADD_ONE = "notes/ADD_ONE";
const LOAD = "notes/LOAD";

const addOneNote = note => ({
  type: ADD_ONE,
  note,
});

const load = list => ({
  type: LOAD,
  list,
});

export const getNotes = userId => async dispatch => {
  const response = await fetch(`/api/note/${userId}`);

  if (response.ok) {
    const notes = await response.json();
    dispatch(load(notes));
  }
};

export const createNote = note => async dispatch => {
  const { content, title, user_id } = note;
  const response = await csrfFetch("/api/note", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, title, user_id }),
  });
  console.log("this is the note ===================>", note);
  console.log("this is the response:", response);
  if (response.ok) {
    const note = await response.json();
    dispatch(addOneNote(note));
    return response;
  }
};

const initialState = {};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ONE: {
      //maybe deleting below alows overwritting note
      //   if (!state[action.note.id]) {
      const newState = {
        ...state,
        [action.note.id]: action.note,
      };
      console.log("this is the newState:", newState);
      return newState;
      //   }
      //   console.log({
      //     ...state,
      //     [action.note.id]: {
      //       ...state[action.note.id],
      //       ...action.note,
      //     },
      //   });
      //   return {
      //     ...state,
      //     [action.note.id]: {
      //       ...state[action.note.id],
      //       ...action.note,
      //     },
      //   };
    }
    case LOAD: {
      const newNotes = {};
      return {
        ...state,
        ...newNotes,
      };
    }
    default:
      return state;
  }
};

export default notesReducer;
