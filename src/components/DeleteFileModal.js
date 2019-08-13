import React, { useContext } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Store } from "./Store";

const DeleteFileModal = props => {
  const { state, dispatch } = useContext(Store);
  if (state.currentFile === props.fileToDelete) {
    return (
      <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
        <ModalBody className="modalHeaderCentered">
          You can't delete a notebook that you're currently using
        </ModalBody>
      </Modal>
    );
  } else if (
    state.currentFile !== props.fileToDelete &&
    props.response === null
  ) {
    return (
      <Modal isOpen={props.isModalOpen} toggle={props.toggleModal}>
        <ModalHeader className="modalHeaderCentered">
          {`Are you sure you want to delete notebook: ${props.fileToDelete}?`}
        </ModalHeader>
        <ModalBody className="openDatePicker">
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            onClick={props.toggleModal}
          >
            Close
          </Button>{" "}
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            onClick={() => {
              props.deleteFile();
              dispatch({
                type: "DELETE_FILE",
                payload: {
                  deletedFile: props.fileToDelete
                }
              });
            }}
          >
            Delete
          </Button>
        </ModalBody>{" "}
      </Modal>
    );
  } else if (props.response !== null) {
    return (
      <Modal
        onClosed={props.resetResponse}
        isOpen={props.isModalOpen}
        toggle={props.toggleModal}
      >
        <ModalBody className="modalHeaderCentered">{props.response}</ModalBody>
      </Modal>
    );
  }
};

export default DeleteFileModal;
