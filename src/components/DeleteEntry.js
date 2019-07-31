import React, { useContext } from "react";
import { Button } from "reactstrap";
import { Store } from "./Store";

const DeleteEntry = props => {
  const { dispatch } = useContext(Store);
  return (
    <Button
      outline
      color="secondary"
      className="m-2"
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
  );
};

export default DeleteEntry;
