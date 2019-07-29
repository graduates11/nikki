import React, { useContext } from "react";
import { Container, Row, Col, Button } from "reactstrap";
import {
  EntriesByDate,
  MyCalendar,
  SearchBar,
  TextEditor
} from "../src/components";
import { Store } from "./components/Store";
const shortid = require("shortid");

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default function App() {
  const { state, dispatch } = useContext(Store);
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
            {state.entry !== null ? (
              <TextEditor />
            ) : (
              <Button
                onClick={() =>
                  dispatch({
                    type: "GET_ENTRY",
                    payload: {
                      entry: {
                        id: shortid.generate(),
                        title: "My title...",
                        text: "Your text...",
                        date: new Date()
                      }
                    }
                  })
                }
              >
                Add entry
              </Button>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
