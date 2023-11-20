const SELECT_NOTEBOOK = "notes/SELECT_NOTEBOOK";

const selectNotebook = notebook => ({
  type: SELECT_NOTEBOOK,
  notebook,
});

export const setSelectedNotebook = notebook => async dispatch => {
  dispatch(selectNotebook(notebook));
};

const initialState = null;

const selectNotebookReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_NOTEBOOK: {
      const newState = action.notebook;
      return newState;
    }

    default:
      return state;
  }
};

export default selectNotebookReducer;
