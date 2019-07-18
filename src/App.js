import React from "react";
import { Container, Row, Col } from "reactstrap";
import SearchBar from "./components/SearchBar";
import TextEditor from "./components/TextEditor";
import EntriesByDate from "./components/entriesByDate";
import MyCalendar from "./components/myCalendar";

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default function App() {
  // myDate = value => {
  //   this.setState({
  //     date: value
  //   });
  // };

  return (
    <div className="App mt-3 mb-3">
      <Container style={styles.fullHeight}>
        <Row style={styles.fullHeight}>
          <Col xs={4} className="border border-muted">
            <SearchBar />
            <MyCalendar />
            <EntriesByDate />
          </Col>
          <Col xs={8} className="border border-muted">
            <TextEditor />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
