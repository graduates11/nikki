import React from "react";
import moment from "moment";
import localization from "moment/locale/de";
moment.locale("de", localization);

export const Store = React.createContext();
const day = new Date();
const initialState = {
  date: day,
  convertedDate: moment(day).format("L"),
  entry: {
    titel: "",
    text: ""
  }
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_DATE":
      return {
        date: action.payload.date,
        convertedDate: action.payload.convertedDate
      };
    case "GET_ENTRY":
      return {
        date: action.payload.date,
        entry: { titel: action.payload.titel, text: action.payload.text }
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
