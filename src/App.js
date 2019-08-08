import React, { useContext } from "react";
import { Container, Col } from "reactstrap";
import Moment from "moment";
import {
  EntriesByDate,
  MyCalendar,
  SearchBar,
  TextEditor,
  SearchResult,
  CurrentFileName
} from "../src/components";
import { Store } from "./components/Store";
import { EditorState, convertToRaw, ContentState } from "draft-js";

const shortid = require("shortid");

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
          title: Moment(new Date(state.date)).format("Do MMMM YYYY, h:mm"),
          text: "",
          date: state.date.toDateString(),
          editorState: convertToRaw(content.getCurrentContent())
        }
      }
    });
  };
  return (
    <div className="App mainViewFlex">
      <CurrentFileName />
      <Col className="border border-muted leftColumn">
        <SearchBar />
        {state.searchBoolean === true ? <SearchResult /> : null}
        <MyCalendar />
        {state.searchBoolean === true ? null : (
          <EntriesByDate addEntry={addEntry} />
        )}
      </Col>
      <Col className="border border-muted rightColumn">
        {state.entry !== null ? (
          <TextEditor />
        ) : (
          <Container className="w-100x add-entry" onClick={addEntry}>
            <p>Add entry</p>
          </Container>
        )}
      </Col>
    </div>
  );
}
