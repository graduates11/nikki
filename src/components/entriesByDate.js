import React, { Component } from "react";

class EntriesByDate extends Component {
  state = { entry: [] };

  componentDidMount() {
    const { entries } = require("../lowdb/db.json");

    //Create a Array with all unique Dates of the Entries
    let uniqueDate = new Set();
    for (let entry of entries) {
      uniqueDate.add(entry.date);
    }

    //Th Array with the Dates
    uniqueDate = Array.from(uniqueDate);
    this.setState({
      entries,
      uniqueDate
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      const filterdate = this.state.entries.filter(
        x => x.date === this.props.date
      );

      this.setState({
        entry: filterdate
      });
    }
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
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default EntriesByDate;
