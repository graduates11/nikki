import React, { Component } from "react";
import Calendar from "react-calendar";
import moment from "moment";
import localization from "moment/locale/de";
moment.locale("de", localization);

const { entries } = require("../lowdb/db.json");

let datesWithEntries = [];
for (let entry of entries) {
  const dateWithEntry = new Date(entry.date).toDateString();
  datesWithEntries.push(dateWithEntry);
}

class myCalendar extends Component {
  state = {
    date: new Date(),
    convertedDate: null
  };

  componentDidMount() {
    let date = moment(this.state.date).format("L");
    this.setState({
      convertedDate: date
    });
    this.props.myDate(date);
  }

  onChange = date => {
    this.setState({ date });
    const newdate = moment(date).format("L");
    this.setState({ convertedDate: newdate });
    this.props.myDate(newdate);
  };

  tileClassName = ({ date, view }) => {
    return view === "month" && datesWithEntries.includes(date.toDateString())
      ? "highlight"
      : null;
  };

  render() {
    return (
      <div>
        <Calendar
          onChange={this.onChange}
          value={this.state.date}
          tileClassName={this.tileClassName}
        />
      </div>
    );
  }
}

export default myCalendar;
