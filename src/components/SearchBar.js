import React, { useContext, useState } from "react";
import { Store } from "./Store";
import { InputGroup, InputGroupAddon, Input, Button } from "reactstrap";

const Fuse = require("fuse.js");

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

  const handleSubmit = event => {
    const fuse = new Fuse(state.allEntries, options);
    const result = fuse.search(value);
    dispatch({
      type: "SEARCH",
      payload: { searchResult: result }
    });
    event.preventDefault();
  };

  const clearSearch = event => {
    dispatch({
      type: "CLEAR_SEARCH"
    });
    setValue("");
    event.preventDefault();
  };

  return (
    <div>
      <InputGroup>
        <form onSubmit={handleSubmit}>
          <Input
            className="mt-2"
            placeholder="Search"
            type="text"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
        </form>
        <InputGroupAddon addonType="append">
          <Button color="secondary" className="mt-2" onClick={clearSearch}>
            x
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

export default SearchBar;
