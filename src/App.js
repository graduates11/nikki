import React from "react";
import { Container, Row, Col } from "reactstrap";
import {
  EntriesByDate,
  MyCalendar,
  SearchBar,
  TextEditor
} from "../src/components";

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default function App() {
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
