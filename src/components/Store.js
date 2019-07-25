import React from "react";

export const Store = React.createContext();
const day = new Date();
const initialState = {
  date: day,
  entry: {},
  entriesByDate: []
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATE":
      return {
        date: action.payload.date
      };
    case "GET_ENTRY":
      return {
        date: action.payload.date,
        entry: action.payload.entry
      };
    case "GET_ALL_ENTRIES":
      return {
        date: action.payload.date,
        entriesByDate: action.payload.entriesByDate
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
