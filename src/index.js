import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./App.scss";
import * as serviceWorker from "./serviceWorker";
import { reducer, Store } from "./components/Store";
import AppLayout from "./components/AppLayout";

const { ipcRenderer } = window;
let initialState;

function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

ipcRenderer.on("init-reply", (event, response) => {
  const { currentFile, files, entries } = JSON.parse(response);
  console.log(entries.map(entry => entry.date));
  initialState = {
    date: new Date(),
    entry: null,
    allEntries: entries,
    searchResult: null,
    searchBoolean: false,
    currentFile,
    allFiles: files
  };

  ReactDOM.render(<AppLayout />, document.getElementById("root"));
  // ReactDOM.render(
  //   <StoreProvider>
  //     <App />
  //   </StoreProvider>,
  //   document.getElementById("root")
  // );
});

ipcRenderer.send("init");

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
