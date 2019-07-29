import React, { useContext } from "react";
import { Store } from "./Store";

const DeleteEntry = props => {
  const { dispatch } = useContext(Store);
  return (
    <button
      id={props.id}
      onClick={() => {
        dispatch({
          type: "DELETE_ENTRY",
          payload: {
            id: props.id
          }
        });
      }}
    >
      x
    </button>
  );
};

export default DeleteEntry;
