import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import TextEditor from "./components/TextEditor";
// import EntriesByDate from "./components/entriesByDate";
import EntriesByTag from "./components/entriesByTag";

class App extends Component {
  render() {
    return (
      <div className="App">
        <EntriesByTag />
        <SearchBar />
        <TextEditor />
      </div>
    );
  }
}

export default App;
