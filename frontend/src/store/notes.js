import { csrfFetch } from "./csrf";

const ADD_ONE = "notes/ADD_ONE";
const LOAD = "notes/LOAD";
const REMOVE_NOTE = "notes/REMOVE_NOTE";
const REMOVE_USER = "session/removeUser";

const addOneNote = note => ({
  type: ADD_ONE,
  note,
});

const load = list => ({
  type: LOAD,
  list,
});

const remove = id => ({
  type: REMOVE_NOTE,
  id,
});

export const deleteNote = id => async dispatch => {
  const response = await csrfFetch(`/api/note/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await response.json();
    dispatch(remove(id));
    return response;
  }
};

export const editNote = note => async dispatch => {
  const { content, title, id, notebookId } = note;
  const response = await csrfFetch(`/api/note/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, title, id, notebookId }),
  });
  if (response.ok) {
    dispatch(addOneNote(note));
    return response;
  }
};

export const getNotes = userId => async dispatch => {
  const response = await fetch(`/api/note/${userId}`);

  if (response.ok) {
    const notes = await response.json();
    dispatch(load(notes));
    return response;
  }
};

export const createNote =
  ({ content, title, userId, notebookId }) =>
  async dispatch => {
    const response = await csrfFetch("/api/note", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, title, userId, notebookId }),
    });

    if (response.ok) {
      const note = await response.json();
      dispatch(addOneNote(note));
      return note;
    }
  };

const initialState = {};

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ONE: {
      if (action.note.id) {
        const newState = {
          ...state,
          [action.note.id]: action.note,
        };
        return newState;
      }
    }
    case LOAD: {
      const newNotes = {};
      action.list.forEach(element => {
        newNotes[element.id] = element;
      });
      return {
        ...state,
        ...newNotes,
      };
    }
    case REMOVE_NOTE: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    case REMOVE_USER: {
      return {};
    }
    default:
      return state;
  }
};

export default notesReducer;
