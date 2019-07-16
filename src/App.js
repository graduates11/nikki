import React, { Component } from "react";
import TextEditor from "./components/TextEditor";
// import EntriesByDate from "./components/entriesByDate";
import EntriesByTag from "./components/entriesByTag";

class App extends Component {
  render() {
    return (
      <div className="App">
        <EntriesByTag />
        <TextEditor />
      </div>
    );
  }
}

export default App;
