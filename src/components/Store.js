import React from "react";
export const Store = React.createContext();

// try creating different reducers to improve performance?
let initialDate = { date: new Date() };
export const DateContext = React.createContext();
export const FileContext = React.createContext();

function dateReducer(state, action) {
  switch (action.type) {
    case "SET_DATE": {
      return {
        date: action.payload.date
      };
    }
    default:
      return state;
  }
}

export function DateContextProvider(props) {
  const [state, dispatch] = React.useReducer(dateReducer, initialDate);
  const value = { state, dispatch };
  return (
    <DateContext.Provider value={value}>{props.children}</DateContext.Provider>
  );
}

export function reducer(state, action) {
  const {
    date,
    entry,
    allEntries,
    searchResult,
    currentFile,
    allFiles,
    searchBoolean
  } = state;

  switch (action.type) {
    case "SET_DATE": {
      const filteredEntry = state.allEntries.filter(
        entry => entry.date === action.payload.date.toDateString()
      )[0];
      return {
        date: action.payload.date,
        allEntries,
        entry: filteredEntry ? filteredEntry : null,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    }
    case "GET_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries: state.allEntries,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "CHANGE_DATE": {
      const allEntriesUpdated = state.allEntries.map(entry =>
        entry.id === action.payload.entry.id
          ? (entry = action.payload.entry)
          : entry
      );
      return {
        date: action.payload.date,
        entry: action.payload.entry,
        allEntries: allEntriesUpdated,
        searchBoolean: false,
        allFiles,
        currentFile
      };
    }
    case "ADD_NEW_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry),
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "GET_ALL_ENTRIES": {
      const filteredEntry = // BROKEN
        action.payload.allEntries === undefined
          ? null
          : action.payload.allEntries.filter(
              entry => entry.date === action.payload.date.toDateString()
            )[0];
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry,
        // entry: filteredEntry === undefined ? null : filteredEntry,
        searchBoolean: false,
        currentFile: action.payload.currentFile,
        allFiles: action.payload.allFiles
      };
    }
    case "SEARCH":
      return {
        date,
        allEntries,
        entry,
        searchResult: action.payload.searchResult,
        searchBoolean: true,
        currentFile,
        allFiles
      };
    case "GET_SEARCH_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries,
        searchResult,
        searchBoolean: true,
        currentFile,
        allFiles
      };
    case "CLEAR_SEARCH":
      return {
        date,
        entry,
        allEntries,
        searchResult,
        searchBoolean: false,
        allFiles,
        currentFile
      };
    case "DELETE_ENTRY": {
      const entry =
        state.entry !== null && action.payload.id === state.entry.id
          ? null
          : state.entry;
      return {
        date,
        allEntries: state.allEntries.filter(
          item => item.id !== action.payload.id
        ),
        entry,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    }
    case "UPDATE_ENTRY":
      return {
        date,
        allEntries: allEntries.map(item => {
          if (item.id === action.payload.entry.id) {
            item = action.payload.entry;
            return item;
          } else {
            return item;
          }
        }),
        entry: action.payload.entry,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "CREATE_FILE":
      return {
        date: new Date(),
        currentFile: action.payload.currentFile,
        allEntries: [],
        entry: null,
        searchBoolean: false,
        allFiles: action.payload.allFiles
      };
    case "CHANGE_FILE": {
      return {
        date: new Date(),
        currentFile: action.payload.file,
        allEntries,
        entry: null,
        searchBoolean: false,
        allFiles
      };
    }
    case "DELETE_FILE": {
      return {
        date,
        currentFile,
        allEntries,
        entry,
        searchBoolean,
        allFiles: allFiles.filter(file => file !== action.payload.deletedFile)
      };
    }
    default:
      return state;
  }
}

export const Consumer = Store.Consumer;
