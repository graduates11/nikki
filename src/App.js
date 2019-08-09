import React from "react";
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

const { ipcRenderer } = window;
const shortid = require("shortid");

export default class App extends React.Component {
  static contextType = Store;

  state = {
    isModalOpen: false
  };

  toggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  createFile = () => {};

  onFinalSave = () => {
    const { state } = this.context;
    const entries = [...state.allEntries];
    const { currentFile } = state;
    const data = {
      entries,
      file: currentFile
    };
    ipcRenderer.send("final-save", JSON.stringify(data));
  };

  handleGetAllEntries = (event, data) => {
    const { state, dispatch } = this.context;
    const { entries, files, currentFile } = JSON.parse(data);
    const { date, entry } = state;
    dispatch({
      type: "GET_ALL_ENTRIES",
      payload: {
        date,
        entry,
        allEntries: entries.length > 0 ? entries : [],
        allFiles: files ? files : [],
        currentFile: currentFile
      }
    });
  };

  handleGetAllEntriesError = (event, arg) => {
    // handle error?
    return arg;
  };
  handleMenuSaveFile = (event, arg) => {
    this.onFinalSave();
  };

  handleFinalSaveReply = (event, arg) => {
    // handle success?
    return arg;
  };

  handleFinalSaveError = (event, arg) => {
    // handle error?
    return arg;
  };

  handleChangeFile = (event, file) => {
    this.onFinalSave();
    ipcRenderer.send("get-all-entries", file);
  };

  handleMenuCreateFile = (event, arg) => {
    this.toggleModal();
  };

  handleCreateFileReply = (event, fileName) => {
    const { dispatch, state } = this.context;
    dispatch({
      type: "CREATE_FILE",
      payload: {
        currentFile: fileName,
        allFiles: [...state.allFiles].concat(this.state.fileName)
      }
    });
  };

  componentDidMount() {
    ipcRenderer.on("get-all-entries-reply", this.handleGetAllEntries);
    ipcRenderer.on("menu-save-file", this.handleMenuSaveFile);
    ipcRenderer.on("final-save-reply", this.handleFinalSaveReply);
    ipcRenderer.on("get-all-entries-error", this.handleGetAllEntriesError);
    ipcRenderer.on("menu-create-file", this.handleMenuCreateFile);
    ipcRenderer.on("change-file", this.handleChangeFile);
    ipcRenderer.on("create-file-reply", this.handleCreateFileReply);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      "get-all-entries-reply",
      this.handleGetAllEntries
    );
    ipcRenderer.removeListener(
      "get-all-entries-error",
      this.handleGetAllEntriesError
    );
    ipcRenderer.removeListener("menu-save-file", this.handleMenuSaveFile);
    ipcRenderer.removeListener("final-save-reply", this.handleFinalSaveReply);
    ipcRenderer.removeListener("change-file", this.handleChangeFile);
    ipcRenderer.removeListener("menu-create-file", this.handleMenuCreateFile);
    ipcRenderer.removeListener("create-file-reply", this.handleCreateFileReply);
  }

  addEntry = () => {
    const { dispatch, state } = this.context;
    const content = EditorState.createWithContent(
      ContentState.createFromText("Your text...")
    );
    const time = ` – ${Moment(new Date()).format("LT")}`;
    const dateWithTime = Moment(new Date(state.date))
      .format("Do MMMM YYYY")
      .concat(time);
    const dateWithoutTime = Moment(new Date(state.date)).format("Do MMMM YYYY");
    dispatch({
      type: "ADD_NEW_ENTRY",
      payload: {
        entry: {
          id: shortid.generate(),
          title:
            new Date().toDateString() === state.date.toDateString()
              ? dateWithTime
              : dateWithoutTime,
          text: "",
          date: state.date.toDateString(),
          editorState: convertToRaw(content.getCurrentContent())
        }
      }
    });
  };
  render() {
    const { state } = this.context;
    return (
      <div className="App mainViewFlex">
        <CurrentFileName />
        <Col className="border border-muted leftColumn">
          <SearchBar />
          {state.searchBoolean === true ? <SearchResult /> : null}
          <MyCalendar />
          {state.searchBoolean === true ? null : (
            <EntriesByDate addEntry={this.addEntry} />
          )}
        </Col>
        <Col className="border border-muted rightColumn">
          {state.entry !== null ? (
            <TextEditor />
          ) : (
            <Container className="mt-2 w-100 add-entry" onClick={this.addEntry}>
              <p>+ Add entry</p>
            </Container>
          )}
        </Col>
      </div>
    );
  }
}
