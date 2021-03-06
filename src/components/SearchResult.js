import React, { useContext } from "react";
import { Store } from "./Store";
import { ListGroup, ListGroupItem } from "reactstrap";
import Moment from "moment";

const SearchResult = () => {
  const { state, dispatch } = useContext(Store);
  return (
    <div className="searchResultListSize">
      {state.searchResult === undefined ? null : (
        <ListGroup flush>
          {state.searchResult.length === 0 ? (
            <div id="noResultDiv">
              <p>no entries found</p>
            </div>
          ) : (
            state.searchResult.map(entry => (
              <ListGroupItem
                className="resultListText resultList resultListPadding"
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
                <p className="resultTitle">{entry.title}</p>{" "}
                <p className="resultDate">{Moment(entry.date).format("L")}</p>
              </ListGroupItem>
            ))
          )}
        </ListGroup>
      )}
    </div>
  );
};

export default SearchResult;
