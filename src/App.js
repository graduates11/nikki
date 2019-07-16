import React, { Component } from "react";
import SearchBar from "./components/SearchBar";
import TextEditor from "./components/TextEditor";
import EntriesByDate from "./components/entriesByDate";

class App extends Component {
  render() {
    return (
      <div className="App">
        <SearchBar />
        <EntriesByDate />
        <TextEditor />
      </div>
    );
  }
}

export default App;
