import React, { useContext } from "react";
import { Container, Row, Col } from "reactstrap";
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
import { defaultTitle } from "./utils/helpers";
const { ipcRenderer } = window;
const shortid = require("shortid");

const styles = {
  fullHeight: {
    height: "100vh"
  }
};

export default function App() {
  const { state, dispatch } = useContext(Store);
  const onFinalSave = () => {
    const entries = [...state.allEntries];
    const { currentFile } = state;
    const data = {
      entries,
      file: currentFile
    };
    ipcRenderer.send("final-save", JSON.stringify(data));
    return new Promise((resolve, reject) => {
      ipcRenderer.once("final-save-reply", (event, response) => {
        resolve(response);
      });
      ipcRenderer.once("final-save-error", (event, args) => {
        reject(args);
      });
    });
  };
  ipcRenderer.on("change-file", async (event, file) => {
    console.log(file);
    onFinalSave();
    ipcRenderer.send("get-all-entries", file);
    return new Promise((resolve, reject) => {
      ipcRenderer.once("get-all-entries-reply", (event, data) => {
        resolve(data);
        const { entries, files, currentFile } = JSON.parse(data);
        dispatch({
          type: "GET_ALL_ENTRIES",
          payload: {
            allEntries: entries.length > 0 ? entries : [],
            allFiles: files ? files : [],
            currentFile: currentFile
          }
        });
      });
      ipcRenderer.once("get-all-entries-error", (event, args) => {
        reject(args);
      });
    });
    // 1. SAVE CURRENT FILE (const onSave = () => { data: { currentFile, entries }})
    // 2. send "get-all-entries" event to access the picked file
    // 3. dispatch new entries to the store
  });

  // ipcRenderer.on("create-file", async (event, arg) => {

  // })
  // ipcRenderer.on("save-file", async (event, arg) => {

  // })
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
      <CurrentFileName />
      <Container style={styles.fullHeight}>
        <Row style={styles.fullHeight}>
          <Col xs={4} className="border border-muted">
            <SearchBar />
            {state.searchBoolean === true ? <SearchResult /> : null}
            <MyCalendar />
            {state.searchBoolean === true ? null : (
              <EntriesByDate addEntry={addEntry} />
            )}
          </Col>
          <Col xs={8} className="border border-muted">
            {state.entry !== null ? (
              <TextEditor />
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
