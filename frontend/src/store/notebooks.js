import { csrfFetch } from "./csrf";

const ADD_ONE = "notebooks/ADD_ONE";
const LOAD = "notebooks/LOAD";
const REMOVE_NOTEBOOK = "notebooks/REMOVE_NOTE";

const addOneNotebook = notebook => ({
  type: ADD_ONE,
  notebook,
});

const load = list => ({
  type: LOAD,
  list,
});

const remove = id => ({
  type: REMOVE_NOTEBOOK,
  id,
});

export const deleteNotebook = id => async dispatch => {
  const response = await csrfFetch(`/api/notebook/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    await response.json();
    dispatch(remove(id));
    return response;
  }
};

export const editNotebook = notebook => async dispatch => {
  const { name, id } = notebook;
  const response = await csrfFetch(`/api/notebook/edit/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, id }),
  });
  if (response.ok) {
    const notebook = await response.json();
    dispatch(addOneNotebook(notebook));
    return response;
  }
};

export const getNotebooks = userId => async dispatch => {
  const response = await fetch(`/api/notebook/${userId}`);

  if (response.ok) {
    const notebooks = await response.json();
    dispatch(load(notebooks));
    return response;
  }
};

export const createNotebook = notebook => async dispatch => {
  const { name, userId } = notebook;
  const response = await csrfFetch("/api/notebook", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, userId }),
  });
  if (response.ok) {
    const notebook = await response.json();
    dispatch(addOneNotebook(notebook));
    return response;
  }
};

const initialState = {};

const notebooksReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ONE: {
      if (action.notebook.id) {
        const newState = {
          ...state,
          [action.notebook.id]: action.notebook,
        };
        return newState;
      } else {
        return state;
      }
    }
    case LOAD: {
      const newNotebooks = {};
      action.list.forEach(element => {
        newNotebooks[element.id] = element;
      });
      return {
        ...state,
        ...newNotebooks,
      };
    }
    case REMOVE_NOTEBOOK: {
      const newState = { ...state };
      delete newState[action.id];
      return newState;
    }
    default:
      return state;
  }
};

export default notebooksReducer;
