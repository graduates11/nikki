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
    const { dispatch } = this.context;
    this.props.toggleModal();
    this.onFinalSave();
    ipcRenderer.send("create-file", this.state.fileName);
    return new Promise((resolve, reject) => {
      ipcRenderer.once("create-file-reply", (event, response) => {
        resolve(response);
        dispatch({
          type: "CHANGE_FILE",
          payload: {
            file: this.state.fileName
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
    const { file } = this.context.state;
    const data = {
      entries,
      file
    };
    ipcRenderer.send("final-save", data);
    return new Promise((resolve, reject) => {
      ipcRenderer.once("final-save-reply", (event, response) => {
        resolve(response);
      });
      ipcRenderer.once("final-save-error", (event, args) => {
        reject(args);
      });
    });
  };

  getAppData = () => {
    const { dispatch } = this.context;
    ipcRenderer.send("get-app-data");
    return new Promise((resolve, reject) => {
      ipcRenderer.once("get-app-data-reply", (event, response) => {
        resolve(response);
        console.log(response);
        dispatch({
          type: "GET_APP_DATA",
          payload: {
            currentFile: response.currentFile
              ? response.currentFile
              : "My Journal"
          }
        });
      });

      ipcRenderer.once("get-app-data-error", (event, args) => {
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
            onClick={this.getAppData}
            outline
            color="secondary"
            className="m-2"
          >
            Get app data
          </Button>
        </ModalBody>
      </Modal>
    );
  }
}
