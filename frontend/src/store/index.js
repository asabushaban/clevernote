import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./session";
import notesReducer from "./notes";
import notebooksReducer from "./notebooks";
import selectNotebookReducer from "./selectedNotebook";
import selectNoteReducer from "./selectedNote";

//add additionalitems for the reducer here
const rootReducer = combineReducers({
  session: sessionReducer,
  notes: notesReducer,
  notebooks: notebooksReducer,
  selectedNote: selectNoteReducer,
  selectedNotebook: selectNotebookReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require("redux-logger").default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = preloadedState => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
