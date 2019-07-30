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
      {result.length === 0 ? (
        <p>No Entry for that date</p>
      ) : (
        <ul>
          {result.map(entry => (
            <li
              key={entry.id}
              onClick={e => {
                dispatch({
                  type: "GET_ENTRY",
                  payload: {
                    date: state.date,
                    entry
                  }
                });
              }}
            >
              {entry.title}
              <DeleteEntry id={entry.id} date={entry.date} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EntriesByDate;
