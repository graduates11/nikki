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
    this.props.toggleModal();
    this.props.onFinalSave();
    ipcRenderer.send("create-file", this.state.fileName);
  };

  render() {
    return (
      <Modal isOpen={this.props.isModalOpen}>
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
        </ModalBody>
      </Modal>
    );
  }
}
