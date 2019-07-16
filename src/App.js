import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import SearchBar from "./components/SearchBar";
import TextEditor from "./components/TextEditor";
import EntriesByDate from "./components/entriesByDate";

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

class App extends Component {
  render() {
    return (
      <div className="App">
        <Container style={styles.fullHeight}>
          <Row style={styles.fullHeight}>
            <Col className="border border-dark">
              <SearchBar />
              <EntriesByDate />
            </Col>
            <Col className="border border-dark">
              <TextEditor />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
