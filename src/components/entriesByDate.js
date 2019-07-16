import React, { Component } from "react";

const { entries } = require("../lowdb/db.json");
const testdate = "18.01.2019";

//Create a Array with all unique Dates of the Entries
let uniqueDate = new Set();
for (let entry of entries) {
  uniqueDate.add(entry.date);
}

//Th Array with the Dates
uniqueDate = Array.from(uniqueDate);

const filterdate = entries.filter(x => x.date === testdate);

class EntriesByDate extends Component {
  state = { entry: [] };

  componentDidMount() {
    this.setState({
      entry: filterdate
    });
  }

  render() {
    return (
      <div>
        {this.state.entry.length === 0 ? (
          <p>No Entries for this day</p>
        ) : (
          <ul>
            {this.state.entry.map(x => (
              <li key={x.id}>
                <h2>{x.title}</h2>
                {/* the date is just to check if the right entries a shown and will be deleted later */}
                <p>{x.date}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default EntriesByDate;
