import React from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Store } from "./Store";

const { ipcRenderer } = window;
export default class AddFileModal extends React.Component {
  static contextType = Store;
  state = {
    fileName: ""
  };

  onFileNameChange = e => {
    this.setState({ fileName: e.target.value });
  };

  createFile = () => {
    const { state, dispatch } = this.context;
    this.props.toggleModal();
    this.onFinalSave();
    ipcRenderer.send("create-file", this.state.fileName);
    return new Promise((resolve, reject) => {
      ipcRenderer.once("create-file-reply", (event, response) => {
        resolve(response);
        dispatch({
          type: "CREATE_FILE",
          payload: {
            file: this.state.fileName,
            allFiles: [...state.allFiles].concat(this.state.fileName)
          }
        });
      });
      ipcRenderer.once("create-file-error", (event, args) => {
        reject(args);
      });
    });
  };

  onFinalSave = () => {
    const entries = [...this.context.state.allEntries];
    const { currentFile } = this.context.state;
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

  changeFile = async file => {
    this.props.toggleModal();
    this.onFinalSave();
    ipcRenderer.send("get-all-entries", file);
    return new Promise((resolve, reject) => {
      ipcRenderer.once("get-all-entries-reply", (event, data) => {
        resolve(data);
        const { entries, files, currentFile } = JSON.parse(data);

        this.context.dispatch({
          type: "GET_ALL_ENTRIES",
          payload: {
            allEntries: entries.length > 0 ? entries : [],
            allFiles: files ? files : [],
            currentFile: currentFile,
            date: this.context.state.date,
            entry: this.context.state.entry
          }
        });
      });
      ipcRenderer.once("get-all-entries-error", (event, args) => {
        reject(args);
      });
    });
  };

  render() {
    return (
      <Modal isOpen={this.props.modal}>
        <ModalBody>
          <ModalHeader>How would you like to name your file?</ModalHeader>
          <Input
            maxLength="20"
            type="text"
            autoFocus
            onChange={this.onFileNameChange}
          ></Input>
          <Button
            onClick={this.createFile}
            outline
            color="secondary"
            className="m-2"
          >
            Submit
          </Button>
          <Button
            onClick={this.props.toggleModal}
            outline
            color="secondary"
            className="m-2"
          >
            Close
          </Button>
          <Button
            onClick={this.onFinalSave}
            outline
            color="secondary"
            className="m-2"
          >
            Final Save
          </Button>
          {this.context.state.allFiles.map((file, i) => {
            return (
              <Button
                onClick={() => this.changeFile(file)}
                key={i}
                outline
                color="secondary"
                className="m-2"
              >
                {file}
              </Button>
            );
          })}
        </ModalBody>
      </Modal>
    );
  }
}
