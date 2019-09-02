import React from "react";
import { Button, Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Store } from "./Store";
const { ipcRenderer } = window;

export default class AddFileModal extends React.Component {
  static contextType = Store;
  state = {
    fileName: null,
    error: null,
    isDisabled: true
  };

  onFileNameChange = e => {
    this.setState({
      fileName: e.target.value,
      isDisabled: e.target.value.length > 0 ? false : true
    });
  };

  validateFileName = () => {
    const { fileName, error } = this.state;
    const regex = /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/;
    if (fileName.match(regex) === null || !/\S/.test(fileName)) {
      this.setState({
        error: "Invalid journal name"
      });
    } else if (this.context.state.allFiles.includes(fileName)) {
      this.setState({
        error: `${fileName} already exists`
      });
    } else {
      error &&
        this.setState({
          error: null
        });
      this.createFile();
    }
  };

  cancel = () => {
    this.setState({
      error: null
    });
    this.props.toggleModal();
  };

  createFile = () => {
    this.props.toggleModal();
    this.props.onFinalSave();
    ipcRenderer.send("create-file", this.state.fileName);
  };

  render() {
    const { error, isDisabled } = this.state;
    return (
      <Modal isOpen={this.props.isModalOpen} toggle={this.props.toggleModal}>
        <ModalBody className="modalHeaderCentered">
          <ModalHeader className="modalHeaderCentered">
            How would you like to name your journal?
          </ModalHeader>
          <Input
            maxLength="20"
            type="text"
            autoFocus
            placeholder="My journal..."
            onChange={this.onFileNameChange}
          ></Input>

          <p className="modal-error">{error && error}</p>

          <Button
            onClick={this.cancel}
            color="white"
            className="button button--antiman button--round-l button--text-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={this.validateFileName}
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            disabled={isDisabled}
          >
            Submit
          </Button>
        </ModalBody>
      </Modal>
    );
  }
}
