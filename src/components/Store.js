import React from "react";

export const Store = React.createContext();

const initialState = {
  date: new Date(),
  entry: null,
  allEntries: [],
  searchBoolean: false,
  file: "db"
};

function reducer(state, action) {
  const { date } = state;
  const allEntries = [...state.allEntries];
  const { entry } = state;
  const { searchResult } = state;
  const { file } = state;
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
        file
      };
    }
    case "GET_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries: state.allEntries,
        searchBoolean: false,
        file
      };
    case "ADD_NEW_ENTRY":
      return {
        date: action.payload.entry.date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry),
        searchBoolean: false,
        file
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry,
        searchBoolean: false,
        file
      };
    case "SEARCH":
      return {
        date,
        allEntries,
        entry,
        searchResult: action.payload.searchResult,
        searchBoolean: true,
        file
      };
    case "GET_SEARCH_ENTRY":
      return {
        date,
        entry: action.payload.entry,
        allEntries,
        searchResult,
        searchBoolean: true,
        file
      };
    case "DELETE_ENTRY":
      return {
        date,
        allEntries: state.allEntries.filter(
          item => item.id !== action.payload.id
        ),
        entry: null,
        searchBoolean: false,
        file
      };
    case "UPDATE_ENTRY":
      return {
        date,
        allEntries: state.allEntries.map(item => {
          if (item.id === action.payload.entry.id) {
            item = action.payload.entry;
            return item;
          } else {
            return item;
          }
        }),
        entry: action.payload.entry,
        searchBoolean: false,
        file
      };
    case "CHANGE_FILE":
      return {
        date: new Date(),
        file: action.payload.file,
        allEntries: [],
        entry: null,
        searchBoolean: false
      };
    case "GET_APP_DATA":
      return {
        date,
        file: action.payload.currentFile,
        allEntries,
        entry,
        searchBoolean: false
      };
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

export const Consumer = Store.Consumer;
