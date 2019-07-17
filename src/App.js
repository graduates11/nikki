import React, { Component } from "react";
//import SearchBar from "./components/SearchBar";
//import TextEditor from "./components/TextEditor";
import EntriesByDate from "./components/entriesByDate";
//import EntriesByTag from "./components/entriesByTag";
import MyCalendar from "./components/myCalendar";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: ""
    };
  }

  myDate = value => {
    this.setState({
      date: value
    });
  };

  render() {
    return (
      <div className="App">
        <MyCalendar myDate={this.myDate} />
        <EntriesByDate date={this.state.date} />
      </div>
    );
  }
}

export default App;
