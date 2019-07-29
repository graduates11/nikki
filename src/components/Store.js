import React from "react";

export const Store = React.createContext();

const initialState = {
  date: "",
  entry: {},
  allEntries: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATE":
      return {
        date: action.payload.date,
        allEntries: state.allEntries
      };
    case "GET_ENTRY":
      return {
        date: action.payload.date,
        entry: action.payload.entry,
        allEntries: state.allEntries
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        allEntries: action.payload.allEntries
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
