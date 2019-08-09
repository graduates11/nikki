import React, { useContext, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import { Store } from "./Store";

const DeleteEntry = props => {
  const { dispatch } = useContext(Store);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDeleteModal = e => {
    e && e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <span
        className="hover deleteButtonSpan"
        style={{ margin: 0 }}
        onClick={toggleDeleteModal}
      >
        <i className="far fa-times-circle fa-sm"></i>
      </span>
      <Modal isOpen={isOpen}>
        <ModalHeader className="modalHeaderCentered">
          Are you sure you want to delete this entry?
        </ModalHeader>
        <ModalBody className="openDatePicker">
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            onClick={toggleDeleteModal}
          >
            Cancel
          </Button>{" "}
          <Button
            color="white"
            className="button button--antiman button--round-l button--text-medium"
            onClick={() => {
              dispatch({
                type: "DELETE_ENTRY",
                payload: {
                  id: props.id
                }
              });
            }}
          >
            Delete
          </Button>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeleteEntry;
