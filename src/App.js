import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  EntriesByDate,
  MyCalendar,
  SearchBar,
  TextEditor,
  SearchResult
} from "../src/components";
import { Store } from "./components/Store";
import { defaultTitle } from "./components/utils/helpers";
import { EditorState, convertToRaw, ContentState } from "draft-js";
const shortid = require("shortid");

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default function App() {
  const { state, dispatch } = useContext(Store);

  const addEntry = () => {
    const content = EditorState.createWithContent(
      ContentState.createFromText("Your text...")
    );
    dispatch({
      type: "ADD_NEW_ENTRY",
      payload: {
        entry: {
          id: shortid.generate(),
          title: defaultTitle(),
          text: "",
          date: new Date().toDateString(),
          editorState: convertToRaw(content.getCurrentContent())
        }
      }
    });
  };
  return (
    <div className="App mt-3 mb-3">
      <Container style={styles.fullHeight}>
        <Row style={styles.fullHeight}>
          <Col xs={4} className="border border-muted">
            <SearchBar />
            {state.searchBoolean === true ? <SearchResult /> : null}
            <MyCalendar />
            {state.searchBoolean === true ? null : <EntriesByDate />}
          </Col>
          <Col xs={8} className="border border-muted">
            {state.entry !== null ? (
              <TextEditor addEntry={addEntry} />
            ) : (
              <Container className="mt-2 w-100 add-entry" onClick={addEntry}>
                <p>+ Add entry</p>
              </Container>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
