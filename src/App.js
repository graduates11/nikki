import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import SearchBar from "./components/SearchBar.js";
import TextEditor from "./components/TextEditor.js";
import EntriesByDate from "./components/EntriesByDate.js";
import DatePicker from "./components/DatePicker.js";

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

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
      <div className="App mt-3 mb-3">
        <Container style={styles.fullHeight}>
          <Row style={styles.fullHeight}>
            <Col xs={4} className="border border-muted">
              <SearchBar />
              <DatePicker myDate={this.myDate} />
              <EntriesByDate date={this.state.date} />
            </Col>
            <Col xs={8} className="border border-muted">
              <TextEditor />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
