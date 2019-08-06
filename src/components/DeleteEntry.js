import React, { useContext } from "react";
import { Store } from "./Store";

const DeleteEntry = props => {
  const { dispatch } = useContext(Store);
  return (
    <span
      className="hover deleteButtonSpan"
      style={{ margin: 0 }}
      onClick={() => {
        dispatch({
          type: "DELETE_ENTRY",
          payload: {
            id: props.id
          }
        });
      }}
    >
      <i className="far fa-times-circle fa-sm"></i>
    </span>
  );
};

export default DeleteEntry;
