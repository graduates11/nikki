import React from "react";

export const Store = React.createContext();

const initialState = {
  date: "",
  entry: null,
  allEntries: [],
  searchBoolean: false
};

function reducer(state, action) {
  // console.log(action);
  switch (action.type) {
    case "SET_DATE": {
      const filteredEntry = state.allEntries.filter(
        entry => entry.date === action.payload.date.toDateString()
      )[0];
      return {
        date: action.payload.date,
        allEntries: state.allEntries,
        entry: filteredEntry ? filteredEntry : null,
        searchBoolean: false
      };
    }
    case "GET_ENTRY":
      return {
        date: state.date,
        entry: action.payload.entry,
        allEntries: state.allEntries,
        searchBoolean: false
      };
    case "ADD_NEW_ENTRY":
      return {
        date: action.payload.entry.date,
        entry: action.payload.entry,
        allEntries: [...state.allEntries].concat(action.payload.entry),
        searchBoolean: false
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries,
        entry: state.entry,
        searchBoolean: false
      };
    case "SEARCH":
      return {
        date: state.date,
        allEntries: state.allEntries,
        entry: state.entry,
        searchResult: action.payload.searchResult,
        searchBoolean: true
      };
    case "GET_SEARCH_ENTRY":
      return {
        date: state.date,
        entry: action.payload.entry,
        allEntries: state.allEntries,
        searchResult: state.searchResult,
        searchBoolean: true
      };
    case "DELETE_ENTRY":
      return {
        date: action.payload.date,
        allEntries: state.allEntries.filter(
          item => item.id !== action.payload.id
        ),
        entry: null,
        searchBoolean: false
      };
    case "UPDATE_ENTRY":
      return {
        date: state.date,
        allEntries: state.allEntries.map(item => {
          if (item.id === action.payload.entry.id) {
            item = action.payload.entry;
            return item;
          } else {
            return item;
          }
        }),
        entry: action.payload.entry,
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
