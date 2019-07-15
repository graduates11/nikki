import React, { Component } from "react";
import EntriesByDate from "./components/entriesByDate";

class App extends Component {
  render() {
    return (
      <div className="App">
        <EntriesByDate></EntriesByDate>
      </div>
    );
  }
}

export default App;
