import React, { useContext } from "react";
import { Store } from "./Store";
import { DeleteEntry } from "./index";
import { ListGroup, ListGroupItem } from "reactstrap";

const EntriesByDate = () => {
  const { state, dispatch } = useContext(Store);

  let result = state.allEntries.filter(entry => {
    const existing = new Date(entry.date).toDateString();
    const requested = new Date(state.date).toDateString();
    return existing === requested;
  });

  return (
    <div>
      {result.length === 0 ? null : (
        <ListGroup flush>
          {result.map((entry, i) => (
            <ListGroupItem className="resultListPadding" key={i}>
              <div className="resultList">
                <div
                  className="resultListText"
                  onClick={() => {
                    dispatch({
                      type: "GET_ENTRY",
                      payload: {
                        entry
                      }
                    });
                  }}
                >
                  {entry.title}
                </div>
                <DeleteEntry id={entry.id} />
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default EntriesByDate;
