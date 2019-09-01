import React, { useContext, useState } from "react";
import { Store } from "./Store";
import { Input } from "reactstrap";

const Fuse = require("fuse.js");

const options = {
  shouldSort: true,
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["text", "title"]
};

const SearchBar = () => {
  const { state, dispatch } = useContext(Store);
  const [value, setValue] = useState("");

  const handleSubmit = event => {
    const fuse = new Fuse(state.allEntries, options);
    const result = fuse.search(value);
    dispatch({
      type: "SEARCH",
      payload: { searchResult: result }
    });
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="searchBar">
      <Input
        className="mt-2 searchBarBorder"
        placeholder="Search"
        type="search"
        value={value}
        onChange={event => {
          setValue(event.target.value);
          if (event.target.value === "") {
            dispatch({
              type: "CLEAR_SEARCH"
            });
          }
        }}
      ></Input>
    </form>
  );
};

export default SearchBar;
