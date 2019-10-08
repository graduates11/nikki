import React from "react";
export const Store = React.createContext();

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

  let firstEntry;
  let updatedEntries;

  switch (action.type) {
    case "SET_DATE":
      firstEntry = state.allEntries.find(
        entry => entry.date === action.payload.date.toString()
      );
      return {
        date: action.payload.date,
        allEntries,
        entry: firstEntry ? firstEntry : null,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "GET_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries,
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "CHANGE_DATE":
      updatedEntries = state.allEntries.map(entry =>
        entry.id === action.payload.entry.id
          ? (entry = action.payload.entry)
          : entry
      );
      return {
        date: action.payload.date,
        entry: action.payload.entry,
        allEntries: updatedEntries,
        searchBoolean: false,
        allFiles,
        currentFile
      };
    case "ADD_NEW_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry),
        searchBoolean: false,
        currentFile,
        allFiles
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry: null,
        searchBoolean: false,
        currentFile: action.payload.currentFile,
        allFiles: action.payload.allFiles
      };
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
    case "DELETE_ENTRY":
      return {
        date,
        allEntries: state.allEntries.filter(
          item => item.id !== action.payload.id
        ),
        entry:
          state.entry !== null && action.payload.id === state.entry.id
            ? null
            : state.entry,
        searchBoolean: false,
        currentFile,
        allFiles
      };
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
    case "DELETE_FILE":
      return {
        date,
        currentFile,
        allEntries,
        entry,
        searchBoolean,
        allFiles: allFiles.filter(file => file !== action.payload.deletedFile)
      };
    default:
      return state;
  }
}

export const Consumer = Store.Consumer;
