import React, { useContext } from "react";
import { Store } from "./Store";

const SearchResult = () => {
  const { state, dispatch } = useContext(Store);
  return (
    <div>
      {state.searchResult === undefined ? null : (
        <ul>
          {state.searchResult.map(entry => (
            <li
              key={entry.id}
              onClick={() => {
                dispatch({
                  type: "GET_SEARCH_ENTRY",
                  payload: {
                    date: state.date,
                    entry
                  }
                });
              }}
            >
              {entry.date}
              {entry.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResult;
