import React, { useContext } from "react";
import { Store } from "./Store";
import { DeleteEntry } from "./index";

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
        <ul>
          {result.map((entry, i) => (
            <div key={i}>
              <li
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
              </li>
              <DeleteEntry id={entry.id} />
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntriesByDate;
