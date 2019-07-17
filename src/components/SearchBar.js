import * as React from "react";
import { Input } from "reactstrap";

const SearchBar = () => {
  return (
    <div>
      <Input className="mt-2" placeholder="Search..." type="text"></Input>
    </div>
  );
};

export default SearchBar;
