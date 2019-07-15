import React, { Component } from "react";
import TextEditor from "./components/TextEditor";
import EntriesByDate from "./components/entriesByDate";

class App extends Component {
  render() {
    return (
      <div className="App">
        <EntriesByDate />
      <TextEditor />
      </div>
    );
  }
}

export default App;
