import React, { useContext, useState } from "react";
import { Input } from "reactstrap";
import { Store } from "./Store";
const Fuse = require("fuse.js");

// const { entries } = require("../lowdb/db.json");

const options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["text", "title"]
};

const SearchBar = () => {
  const { state, dispatch } = useContext(Store);
  const [value, setValue] = useState("");
  // const [entry, setEntry] = useState(state.allEntries);

  const handleSubmit = event => {
    const fuse = new Fuse(state.allEntries, options); // "list" is the item array
    const result = fuse.search(value);
    dispatch({
      type: "SEARCH",
      payload: { searchResult: result }
    });
    setValue("");
    event.preventDefault();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          className="mt-2"
          placeholder="Search"
          type="text"
          value={value}
          onChange={event => setValue(event.target.value)}
        ></Input>
      </form>
    </div>
  );
};

export default SearchBar;
