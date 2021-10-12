import { csrfFetch } from "./csrf";

const ADD_ONE = "notes/ADD_ONE";

const addOneNote = note => ({
  type: ADD_ONE,
  note,
});

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

const initialState = {
  note: null,
};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ONE: {
      if (!state[action.note.id]) {
        const newState = {
          ...state,
          [action.note.id]: action.note,
        };
        return newState;
      }
      return {
        ...state,
        [action.note.id]: {
          ...state[action.note.id],
          ...action.note,
        },
      };
    }
    default:
      return state;
  }
};

export default notesReducer;
