import React, { Component } from "react";

const { entries, tags } = require("../lowdb/db.json");
const testtag = "omnis";

const filterTag = tags.filter(x => x.text === testtag)["0"].entries;
console.log(filterTag);

let result = [];

for (let entry of entries) {
  if (filterTag.includes(entry.id)) {
    result.push(entry);
  }
}
class EntriesByTag extends Component {
  state = { entry: [] };

  componentDidMount() {
    this.setState({
      entry: result
    });
  }

  render() {
    return (
      <div>
        <h1>{testtag}</h1>
        {this.state.entry.length === 0 ? (
          <p>No Entries for this tag</p>
        ) : (
          <ul>
            {this.state.entry.map(x => (
              <li key={x.id}>
                <h2>{x.title}</h2>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default EntriesByTag;
