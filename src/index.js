import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./App.scss";
import * as serviceWorker from "./serviceWorker";
import { StoreProvider } from "./components/Store";
import "./utils/hashtag.css";
import "./utils/toolbar.css";
import "./utils/link.css";

ReactDOM.render(
  <StoreProvider>
    <App />
  </StoreProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
